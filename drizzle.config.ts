import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/app/lib/db/schema.ts",
  out: "./src/app/lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
// satisfies Config;

// import 'dotenv/config';
// import { defineConfig } from 'drizzle-kit';
// export default defineConfig({
//   out: './drizzle',
//   schema: './src/db/schema.ts',
//   dialect: 'postgresql',
//   dbCredentials: {
//     url: process.env.DATABASE_URL!,
//   },
// });
