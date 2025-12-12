"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { products } from "@/db/schema";

/**
 * Seed products into the database
 * This should be run once to populate the products table
 */
export async function seedProducts() {
  const productData = [
    {
      polarProductId: "50f840ad-1c0a-4abb-8299-da42bd0efcb4",
      name: "Intro",
      slug: "intro",
      price: 0, // Update with actual price if needed
      tokenAmount: 1,
    },
    {
      polarProductId: "142aec44-e133-470a-a974-4bad5fd2e3b5",
      name: "Bronze",
      slug: "bronze",
      price: 0, // Update with actual price if needed
      tokenAmount: 5,
    },
    {
      polarProductId: "11214f6f-6306-479a-a39c-2889ad238791",
      name: "Silver",
      slug: "silver",
      price: 0, // Update with actual price if needed
      tokenAmount: 10,
    },
    {
      polarProductId: "993054d0-69a6-4b76-a71f-a45489049be2",
      name: "Gold",
      slug: "gold",
      price: 0, // Update with actual price if needed
      tokenAmount: 20,
    },
  ];

  try {
    for (const product of productData) {
      // Check if product already exists
      const [existing] = await db
        .select()
        .from(products)
        .where(eq(products.polarProductId, product.polarProductId))
        .limit(1);

      if (existing) {
        console.log(
          `Product already exists: ${product.name} (${product.slug})`
        );
      } else {
        await db.insert(products).values(product);
        console.log(`Inserted product: ${product.name} (${product.slug})`);
      }
    }

    return { success: true, message: "Products seeded successfully" };
  } catch (e) {
    console.error("Error seeding products:", e);
    throw e;
  }
}

/**
 * Get all products from the database
 */
export async function getAllProducts() {
  try {
    const allProducts = await db.select().from(products);
    return allProducts;
  } catch (e) {
    console.error("Error getting products:", e);
    throw e;
  }
}
