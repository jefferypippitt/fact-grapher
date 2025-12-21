"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { products } from "@/db/schema";

export async function seedProducts() {
  const productData = [
    {
      polarProductId: "0d8672dd-3e65-4040-9367-661502ad38a7",
      name: "Intro",
      slug: "intro",
      price: 3,
      tokenAmount: 1,
    },
    {
      polarProductId: "57b45a66-8a91-48e8-90fe-c704d0e48859",
      name: "Bronze",
      slug: "bronze",
      price: 15,
      tokenAmount: 5,
    },
    {
      polarProductId: "7fcbe7f1-6b47-4efa-acd9-04c9e3c3b5f4",
      name: "Silver",
      slug: "silver",
      price: 30,
      tokenAmount: 10,
    },
    {
      polarProductId: "06642b89-e72f-4613-afa7-ad8bee30761f",
      name: "Gold",
      slug: "gold",
      price: 60,
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
          existing.slug !== product.slug ||
          existing.price !== product.price
        ) {
          await db
            .update(products)
            .set({
              tokenAmount: product.tokenAmount,
              name: product.name,
              slug: product.slug,
              price: product.price,
              updatedAt: new Date(),
            })
            .where(eq(products.polarProductId, product.polarProductId));
        }
      } else {
        await db.insert(products).values(product);
      }
    }

    return { success: true, message: "Products seeded successfully" };
  } catch (e) {
    console.error("Error seeding products:", e);
    throw e;
  }
}

export async function getAllProducts() {
  try {
    const allProducts = await db.select().from(products);
    return allProducts;
  } catch (e) {
    console.error("Error getting products:", e);
    throw e;
  }
}
