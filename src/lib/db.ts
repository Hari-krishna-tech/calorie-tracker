import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL!;

  // SQLite (local dev)
  if (dbUrl.startsWith("file:")) {
    const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
    return new PrismaClient({
      adapter: new PrismaBetterSqlite3({ url: dbUrl.replace(/^file:/, "") }),
    });
  }

  // Neon / PostgreSQL (production)
  if (dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://")) {
    const { PrismaNeon } = require("@prisma/adapter-neon");
    return new PrismaClient({
      adapter: new PrismaNeon({ connectionString: dbUrl }),
    });
  }

  throw new Error(`Unsupported DATABASE_URL: ${dbUrl.slice(0, 30)}...`);
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
