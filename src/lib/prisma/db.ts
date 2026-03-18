// src/lib/prisma/db.ts
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

declare global {
  var prisma: PrismaClient | undefined;
}

// Ensure DATABASE_URL exists
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined in your environment variables");
}

// Prisma v7 with Neon adapter requires an object with `url` property
const prisma =
  globalThis.prisma ??
  new PrismaClient({
    adapter: new PrismaNeon({connectionString:databaseUrl }), // wrap URL in object
    log: ["query", "warn", "error"],
  });

// Prevent multiple clients in dev
if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export default prisma;