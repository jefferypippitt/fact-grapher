"use server";

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
    // Get total tokens purchased
    const purchasedTokens = await db
      .select({
        total: sum(products.tokenAmount),
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

    return Math.max(0, purchased - spent);
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

export async function insertPurchase(polarProductId: string, userId: string) {
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
        }))
      );
      throw new Error(
        `Product not found for polarProductId: ${polarProductId}`
      );
    }

    await db.insert(purchases).values({
      userId: userData.id,
      productId: product.id,
    });

    // Refresh user tokens in the database after purchase
    await refreshUserTokens(userData.id);

    // Revalidate dashboard and related paths to ensure UI updates
    revalidatePath("/dashboard");
    revalidatePath("/");

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
