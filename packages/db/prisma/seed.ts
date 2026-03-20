/**
 * Database Seed
 *
 * Seeds the database with placeholder data for development.
 * Run with: npm run db:seed --workspace=packages/db
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // TODO: Add seed data
  // - Create a test student user
  // - Create a test educator user
  // - Create a test document with a version
  // - Create a placeholder receipt

  console.log("✅ Seeding complete");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
