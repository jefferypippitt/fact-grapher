import "dotenv/config";
import { seedProducts } from "@/actions/products";

async function main() {
  try {
    console.log("🌱 Starting product seeding...");
    const result = await seedProducts();
    console.log("✅", result.message);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    process.exit(1);
  }
}

main();
