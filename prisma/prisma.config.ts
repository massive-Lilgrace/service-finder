// Location: service-finder/prisma.config.ts
import { defineConfig } from "@prisma/config";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL, // 🔌 Wire your environment variables directly into Prisma 7 core controller module cleanly
  },
});