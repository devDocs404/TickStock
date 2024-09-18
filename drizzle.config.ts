import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;

// import { drizzle } from "drizzle-orm/node-postgres";
// import { Pool } from "pg";
// import { Logger } from "drizzle-orm/logger";

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// // Create a custom logger
// class CustomLogger implements Logger {
//   logQuery(query: string, params: unknown[]): void {
//     console.log("Query:", query);
//     console.log("Params:", params);
//   }
// }

// export const db = drizzle(pool, { logger: new CustomLogger() });
