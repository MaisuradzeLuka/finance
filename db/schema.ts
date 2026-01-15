import { relations } from "drizzle-orm";
import { date, integer, pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const accountsTable = pgTable("accounts", {
  id: text("id").primaryKey().unique(),
  userId: text("user_id").notNull(),
  plaidId: text("plaid_id"),
  name: text("name").notNull(),
});

export const accountsRelations = relations(accountsTable, ({ many }) => ({
  transactions: many(transactionsTable),
}));

export const insertSchema = createInsertSchema(accountsTable);

export const categoriesTable = pgTable("categories", {
  id: text("id").primaryKey().unique(),
  userId: text("user_id").notNull(),
  plaidId: text("plaid_id"),
  name: text("name").notNull(),
});

export const categoriesRelations = relations(categoriesTable, ({ many }) => ({
  transactions: many(transactionsTable),
}));

export const insertCategoriesSchema = createInsertSchema(categoriesTable);

export const transactionsTable = pgTable("transactions", {
  id: text("id").primaryKey().unique(),
  amount: integer("amount").notNull(),
  date: date("date").notNull(),
  notes: text("notes"),
  payee: text("payee").notNull(),
  accountId: text("account_id")
    .references(() => accountsTable.id, { onDelete: "cascade" })
    .notNull(),
  categoryId: text("category_id").references(() => categoriesTable.id, {
    onDelete: "set null",
  }),
});

export const transactionsRelations = relations(
  transactionsTable,
  ({ one }) => ({
    account: one(accountsTable, {
      fields: [transactionsTable.accountId],
      references: [accountsTable.id],
    }),
    category: one(categoriesTable, {
      fields: [transactionsTable.categoryId],
      references: [categoriesTable.id],
    }),
  })
);

export const insertTransactionsSchema = createInsertSchema(transactionsTable);
