import { PrismaClient } from "../../prisma/generated/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL
  if (!connectionString) {
    return new PrismaClient()
  }

  const isRemote = connectionString.includes('supabase.com') || connectionString.includes('aws') || connectionString.includes('neon.tech')
  const pool = new Pool({
    connectionString,
    ssl: isRemote ? { rejectUnauthorized: false } : undefined,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  })

  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export { prisma, prisma as defaultPrisma }
export default prisma

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma


