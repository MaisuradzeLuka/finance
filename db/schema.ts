import { pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const accountsTable = pgTable("accounts", {
  id: text("id").primaryKey().unique(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
});

export const insertSchema = createInsertSchema(accountsTable);
