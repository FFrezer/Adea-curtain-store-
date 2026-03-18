// src/lib/prisma/prisma.ts
import prisma from "./db"; // default export from db.ts

// Singleton type for globalThis (if needed later)
const globalForPrisma = globalThis as unknown as { prisma?: typeof prisma };

// Export the Prisma client
export { prisma };

// TypeScript type for convenience
export type PrismaClientInstance = typeof prisma;