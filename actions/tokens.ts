"use server";

import { Polar } from "@polar-sh/sdk";
import { eq, sum } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getUserById, getUserSession } from "@/actions/users";
import { db } from "@/db/drizzle";
import { products, purchases, tokenSpends, user } from "@/db/schema";

/**
 * Calculate total tokens for a user
 * Total = (sum of tokenAmount from purchases) - (sum of amount from tokenSpends)
 */
async function getTotalTokens(userId: string | undefined) {
  if (!userId) {
    return 0;
  }

  try {
    // Get total tokens purchased with detailed breakdown
    const purchasedTokens = await db
      .select({
        total: sum(products.tokenAmount),
      })
      .from(purchases)
      .innerJoin(products, eq(purchases.productId, products.id))
      .where(eq(purchases.userId, userId));

    // Get detailed purchase breakdown for debugging
    const purchaseDetails = await db
      .select({
        productName: products.name,
        productSlug: products.slug,
        tokenAmount: products.tokenAmount,
        purchaseId: purchases.id,
      })
      .from(purchases)
      .innerJoin(products, eq(purchases.productId, products.id))
      .where(eq(purchases.userId, userId));

    // Get total tokens spent
    const spentTokens = await db
      .select({
        total: sum(tokenSpends.amount),
      })
      .from(tokenSpends)
      .where(eq(tokenSpends.userId, userId));

    const purchased = Number(purchasedTokens[0]?.total ?? 0);
    const spent = Number(spentTokens[0]?.total ?? 0);
    const total = Math.max(0, purchased - spent);

    console.log(`Token calculation for user ${userId}:`, {
      purchases: purchaseDetails.map((p) => ({
        product: p.productName,
        slug: p.productSlug,
        tokens: p.tokenAmount,
      })),
      totalPurchased: purchased,
      totalSpent: spent,
      finalTotal: total,
    });

    return total;
  } catch (e) {
    console.error("Error calculating total tokens:", e);
    return 0;
  }
}

/**
 * Refresh and update the user's token count in the database
 * This ensures the user.tokens field stays in sync with purchases and spends
 */
export async function refreshUserTokens(userId: string) {
  try {
    const totalTokens = await getTotalTokens(userId);

    await db
      .update(user)
      .set({ tokens: totalTokens })
      .where(eq(user.id, userId));

    return totalTokens;
  } catch (e) {
    console.error("Error refreshing user tokens:", e);
    throw e;
  }
}

export async function getTokens() {
  const session = await getUserSession();

  const totalUserTokens = await getTotalTokens(session?.user?.id);

  return totalUserTokens;
}

/**
 * Alias for getTokens() to match usage in the app
 */
export async function getUserTokens() {
  return await getTokens();
}

export async function insertPurchase(
  polarProductId: string,
  userId: string,
  shouldRevalidate = true
) {
  try {
    const userData = await getUserById(userId);

    console.log("Looking for product with polarProductId:", polarProductId);

    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.polarProductId, polarProductId))
      .limit(1);

    if (!product) {
      // Check what products exist in the database
      const allProducts = await db.select().from(products);
      console.error("Product not found. Searched for:", polarProductId);
      console.error(
        "Available products in database:",
        allProducts.map((p) => ({
          id: p.id,
          polarProductId: p.polarProductId,
          name: p.name,
          slug: p.slug,
          tokenAmount: p.tokenAmount,
        }))
      );
      throw new Error(
        `Product not found for polarProductId: ${polarProductId}`
      );
    }

    console.log(
      `Inserting purchase: userId=${userData.id}, productId=${product.id}, productName=${product.name}, tokenAmount=${product.tokenAmount}`
    );

    await db.insert(purchases).values({
      userId: userData.id,
      productId: product.id,
    });

    // Refresh user tokens in the database after purchase
    const newTokenCount = await refreshUserTokens(userData.id);
    console.log(
      `Purchase inserted. User ${userData.id} now has ${newTokenCount} tokens.`
    );

    // Revalidate dashboard and related paths to ensure UI updates
    // Only if not called from render (e.g., during sync)
    if (shouldRevalidate) {
      revalidatePath("/dashboard");
      revalidatePath("/");
    }

    return product.name;
  } catch (e) {
    console.error("Error inserting purchase:", e);
    throw e;
  }
}

export async function spendTokens(amount: number, action: string) {
  const session = await getUserSession();

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const [tokenSpend] = await db
    .insert(tokenSpends)
    .values({
      userId: session.user.id,
      action,
      amount,
    })
    .returning();

  // Refresh user tokens in the database after spending
  await refreshUserTokens(session.user.id);

  return tokenSpend;
}

/**
 * Deduct tokens from user account
 * This is an alias for spendTokens to match usage in the app
 */
export async function deductTokens(userId: string, amount: number) {
  const [tokenSpend] = await db
    .insert(tokenSpends)
    .values({
      userId,
      action: "deduct",
      amount,
    })
    .returning();

  // Refresh user tokens in the database after deduction
  await refreshUserTokens(userId);

  return tokenSpend;
}

/**
 * Check if an order is already recorded as a purchase
 */
function isOrderAlreadyRecorded(
  orderCreatedAt: Date | null,
  polarProductId: string,
  existingPurchases: Array<{ productId: string; createdAt: Date }>
): boolean {
  if (!orderCreatedAt) {
    return existingPurchases.some((p) => p.productId === polarProductId);
  }

  const orderTime = orderCreatedAt.getTime();
  return existingPurchases.some((p) => {
    const purchaseTime = new Date(p.createdAt).getTime();
    const timeDiff = Math.abs(purchaseTime - orderTime);
    return p.productId === polarProductId && timeDiff < 5 * 60 * 1000;
  });
}

/**
 * Get Polar customer for a user by external ID
 */
async function getPolarCustomerForUser(userId: string, polarClient: Polar) {
  const customersResponse = await polarClient.customers.list({ limit: 100 });

  if (!customersResponse.result?.items) {
    return null;
  }

  return customersResponse.result.items.find((c) => c.externalId === userId);
}

/**
 * Process and sync a single order
 */
async function processOrder(
  order: {
    status?: string;
    product?: { id?: string } | null;
    createdAt?: Date | string;
  },
  existingPurchases: Array<{ productId: string; createdAt: Date }>,
  userId: string
): Promise<boolean> {
  if (order.status !== "paid" || !order.product?.id) {
    return false;
  }

  const polarProductId = order.product.id;
  const orderCreatedAt = order.createdAt ? new Date(order.createdAt) : null;

  if (
    isOrderAlreadyRecorded(orderCreatedAt, polarProductId, existingPurchases)
  ) {
    return false;
  }

  try {
    // Don't revalidate during sync (called from render)
    // The page is already dynamic, so it will show updated data on next request
    await insertPurchase(polarProductId, userId, false);
    console.log(
      `Synced purchase for product ${polarProductId} for user ${userId}`
    );
    return true;
  } catch (error) {
    console.error(
      `Error syncing purchase for product ${polarProductId}:`,
      error
    );
    return false;
  }
}

/**
 * Sync recent purchases from Polar API
 * This is a fallback in case webhooks fail
 */
export async function syncRecentPurchases() {
  try {
    const session = await getUserSession();
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    const polarClient = new Polar({
      accessToken: process.env.POLAR_ACCESS_TOKEN as string,
      server: "sandbox",
    });

    const customer = await getPolarCustomerForUser(
      session.user.id,
      polarClient
    );
    if (!customer?.id) {
      console.log("No Polar customer found for user:", session.user.id);
      return { synced: 0 };
    }

    const ordersResponse = await polarClient.orders.list({
      customerId: customer.id,
      limit: 10,
    });

    if (!ordersResponse.result?.items) {
      console.log("No orders found for customer:", customer.id);
      return { synced: 0 };
    }

    // Get existing purchases for this user with their creation times
    const existingPurchases = await db
      .select({
        productId: products.polarProductId,
        createdAt: purchases.createdAt,
      })
      .from(purchases)
      .innerJoin(products, eq(purchases.productId, products.id))
      .where(eq(purchases.userId, session.user.id));

    let syncedCount = 0;

    for (const order of ordersResponse.result.items) {
      const synced = await processOrder(
        order,
        existingPurchases,
        session.user.id
      );
      if (synced) {
        syncedCount += 1;
      }
    }

    // Note: We don't call revalidatePath here because this function
    // is called during render. The page is already dynamic, so it will
    // show updated data on the next request.

    return { synced: syncedCount };
  } catch (error) {
    console.error("Error syncing recent purchases:", error);
    throw error;
  }
}
