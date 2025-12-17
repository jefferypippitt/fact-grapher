"use server";

import { eq } from "drizzle-orm";
import { cacheLife, cacheTag, updateTag } from "next/cache";
import { db } from "@/db/drizzle";
import { products } from "@/db/schema";

export async function seedProducts() {
  const productData = [
    {
      polarProductId: "50f840ad-1c0a-4abb-8299-da42bd0efcb4",
      name: "Intro",
      slug: "intro",
      price: 0, 
      tokenAmount: 1,
    },
    {
      polarProductId: "142aec44-e133-470a-a974-4bad5fd2e3b5",
      name: "Bronze",
      slug: "bronze",
      price: 0, 
      tokenAmount: 5,
    },
    {
      polarProductId: "11214f6f-6306-479a-a39c-2889ad238791",
      name: "Silver",
      slug: "silver",
      price: 0, 
      tokenAmount: 10,
    },
    {
      polarProductId: "993054d0-69a6-4b76-a71f-a45489049be2",
      name: "Gold",
      slug: "gold",
      price: 0, 
      tokenAmount: 20,
    },
  ];

  try {
    for (const product of productData) {
      const [existing] = await db
        .select()
        .from(products)
        .where(eq(products.polarProductId, product.polarProductId))
        .limit(1);

      if (existing) {
        if (
          existing.tokenAmount !== product.tokenAmount ||
          existing.name !== product.name ||
          existing.slug !== product.slug
        ) {
          await db
            .update(products)
            .set({
              tokenAmount: product.tokenAmount,
              name: product.name,
              slug: product.slug,
              updatedAt: new Date(),
            })
            .where(eq(products.polarProductId, product.polarProductId));
          console.log(
            `Updated product: ${product.name} (${product.slug}) - tokenAmount: ${product.tokenAmount}`
          );
        } else {
          console.log(
            `Product already exists: ${product.name} (${product.slug})`
          );
        }
      } else {
        await db.insert(products).values(product);
        console.log(
          `Inserted product: ${product.name} (${product.slug}) - tokenAmount: ${product.tokenAmount}`
        );
      }
    }

    updateTag("products");

    return { success: true, message: "Products seeded successfully" };
  } catch (e) {
    console.error("Error seeding products:", e);
    throw e;
  }
}

export async function getAllProducts() {
  "use cache";
  cacheLife("hours"); 
  cacheTag("products");

  try {
    const allProducts = await db.select().from(products);
    return allProducts;
  } catch (e) {
    console.error("Error getting products:", e);
    throw e;
  }
}
