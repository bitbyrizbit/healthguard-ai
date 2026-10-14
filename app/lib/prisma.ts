import { PrismaClient } from '@prisma/client'; 
import { PrismaPg } from '@prisma/adapter-pg'; 
import { Pool } from 'pg'; 

const globalForPrisma = globalThis as unknown as { 
  prisma: PrismaClient | undefined; 
}; 

const isRemoteDb = Boolean(
  process.env.DATABASE_URL &&
  !process.env.DATABASE_URL.includes("localhost") &&
  !process.env.DATABASE_URL.includes("postgres-db")
);

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL, 
  ssl: isRemoteDb ? { rejectUnauthorized: false } : undefined,
}); 

const adapter = new PrismaPg(pool); 

const prismaClientSingleton = () => {
  return new PrismaClient({
    adapter,
    log: ['query', 'error', 'warn'],
  })
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
