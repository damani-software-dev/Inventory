import dotenv from 'dotenv'
import { defineConfig, env } from 'prisma/config'

dotenv.config({ path: '.env' })

export default defineConfig({
  schema: 'lib/db/schema.prisma',

  migrations: {
    path: 'lib/db/migrations',
  },

  datasource: {
    url: env('DATABASE_URL'),
  },
})