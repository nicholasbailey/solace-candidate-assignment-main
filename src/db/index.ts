import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Googling says that a single drizzle instance is idiomatic.
let db: ReturnType<typeof drizzle>;

export const getDb = () => {
  // for query purposes
  if (!db) {
    const queryClient = postgres(process.env.DATABASE_URL);
    db = drizzle(queryClient);
  }

  return db;
};
