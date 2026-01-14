import { PrismaLibSql } from '@prisma/adapter-libsql'
import 'dotenv/config'
import { PrismaClient } from 'src/generated/prisma/client'

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

export default prisma
