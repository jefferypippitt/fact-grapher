import "dotenv/config";
import { seedProducts } from "@/actions/products";

async function main() {
  try {
    await seedProducts();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    process.exit(1);
  }
}

main();
