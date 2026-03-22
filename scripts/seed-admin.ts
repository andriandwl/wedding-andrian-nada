/**
 * scripts/seed-admin.ts
 *
 * Creates the first admin account in MongoDB.
 *
 * Usage:
 *   npx ts-node --project tsconfig.seed.json scripts/seed-admin.ts [email] [password]
 *
 * Defaults:
 *   email:    admin@wedding.com
 *   password: admin123
 *
 * Example:
 *   npx ts-node --project tsconfig.seed.json scripts/seed-admin.ts super@admin.com MySecureP@ss!
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Load .env manually (ts-node doesn't load Next.js env)
import { config } from "dotenv";
config({ path: ".env" });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌  MONGODB_URI not found in .env");
  process.exit(1);
}

// Inline schema (can't import from @/ in ts-node without path mapping)
const AdminUserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: { type: String, default: "admin" },
  },
  { timestamps: true },
);

async function main() {
  const email = process.argv[2] ?? "admin@wedding.com";
  const password = process.argv[3] ?? "admin123";

  // Validate args
  if (!email.includes("@")) {
    console.error("❌  Email tidak valid:", email);
    process.exit(1);
  }
  if (password.length < 6) {
    console.error("❌  Password minimal 6 karakter");
    process.exit(1);
  }

  console.log("🔗  Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI as string, {
    serverSelectionTimeoutMS: 8000,
  });
  console.log(
    "✅  Connected to:",
    (MONGODB_URI as string).replace(/:\/\/.*@/, "://<credentials>@"),
  );

  const AdminUser =
    mongoose.models["AdminUser"] ??
    mongoose.model("AdminUser", AdminUserSchema);

  const exists = await AdminUser.exists({ email: email.toLowerCase() });
  if (exists) {
    console.log(`⚠️   Admin with email "${email}" already exists. Skipping.`);
    await mongoose.disconnect();
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await AdminUser.create({
    email: email.toLowerCase(),
    passwordHash,
    role: "admin",
  });

  console.log("");
  console.log("✅  Admin created successfully!");
  console.log("    ID:      ", String(admin._id));
  console.log("    Email:   ", admin.email);
  console.log("    Password:", password, "  ← change this after first login!");
  console.log("");
  console.log("👉  Now run: npm run dev");
  console.log("    Then visit: http://localhost:3000/login");

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("❌  Seed failed:", err.message);
  process.exit(1);
});
