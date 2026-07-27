import { PrismaClient } from "../../prisma/generated/client"
import { PrismaPg } from "@prisma/adapter-pg"

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL
  const adapter = new PrismaPg({ connectionString })
  return new PrismaClient({ adapter })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export { prisma, prisma as defaultPrisma }
export default prisma

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma


