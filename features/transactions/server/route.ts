import { db } from "@/db";
import {
  accountsTable,
  categoriesTable,
  insertSchema,
  insertTransactionsSchema,
  transactionsTable,
} from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod/v4";

const app = new Hono()
  .get("/", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const transactions = await db
      .select()
      .from(transactionsTable)
      .leftJoin(
        categoriesTable,
        eq(transactionsTable.categoryId, categoriesTable.id)
      )
      .innerJoin(
        accountsTable,
        eq(transactionsTable.accountId, accountsTable.id)
      )
      .orderBy(desc(transactionsTable.date));

    const formattedResponse = transactions.map((t) => {
      return {
        ...t.transactions,
        categoryId: t.categories?.id,
        categoryName: t.categories?.name,
        accountName: t.accounts.name,
        accountId: t.accounts.id,
      };
    });
    return c.json(formattedResponse);
  })
  .get(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const auth = getAuth(c);

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "ID is required" }, 400);
      }

      const transactionToGet = db.$with("transaction_to_get").as(
        db
          .select({ id: transactionsTable.id })
          .from(transactionsTable)
          .innerJoin(
            accountsTable,
            eq(transactionsTable.accountId, accountsTable.id)
          )
          .where(
            and(
              eq(accountsTable.userId, auth.userId),
              eq(transactionsTable.id, id)
            )
          )
      );

      const transaction = await db
        .with(transactionToGet)
        .select()
        .from(transactionsTable)
        .leftJoin(
          categoriesTable,
          eq(transactionsTable.categoryId, categoriesTable.id)
        )
        .innerJoin(
          accountsTable,
          eq(transactionsTable.accountId, accountsTable.id)
        )
        .where(
          eq(transactionsTable.id, sql`(SELECT id FROM transaction_to_get)`)
        )
        .limit(1);

      if (!transaction.length) {
        return c.json({ error: "transaction not found" }, 404);
      }

      const formattedResponse = {
        ...transaction[0].transactions,
        categoryId: transaction[0].categories?.id,
        categoryName: transaction[0].categories?.name,
        accountName: transaction[0].accounts.name,
        accountId: transaction[0].accounts.id,
      };

      return c.json(formattedResponse);
    }
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", insertTransactionsSchema.omit({ id: true })),
    async (c) => {
      const auth = getAuth(c);

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const values = c.req.valid("json");

      if (!values) {
        return c.json({ error: "values are required" }, 400);
      }

      const newTransaction = await db
        .insert(transactionsTable)
        .values({ ...values, id: uuidv4() })
        .returning();

      if (!newTransaction.length) {
        return c.json({ error: "Failed to create account" }, 500);
      }

      return c.json(newTransaction[0]);
    }
  )
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator("json", z.object({ ids: z.array(z.string()) })),
    async (c) => {
      const auth = getAuth(c);

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { ids } = c.req.valid("json");

      if (!ids) {
        return c.json({ error: "IDs are required" }, 400);
      }

      const transactionsToDelete = db
        .$with("transactions_to_delete")
        .as(
          db
            .select({ id: transactionsTable.id })
            .from(transactionsTable)
            .innerJoin(
              accountsTable,
              eq(transactionsTable.accountId, accountsTable.id)
            )
            .where(inArray(transactionsTable.id, ids))
        );

      const deletedAccounts = await db
        .with(transactionsToDelete)
        .delete(transactionsTable)
        .where(
          inArray(
            transactionsTable.id,
            sql`(SELECT id FROM transactions_to_delete)`
          )
        )
        .returning();

      if (!deletedAccounts.length) {
        return c.json({ error: "No accounts were deleted" }, 500);
      }

      return c.json({ success: true });
    }
  )
  .patch(
    "/",
    clerkMiddleware(),
    zValidator("json", insertTransactionsSchema),
    async (c) => {
      const auth = getAuth(c);

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const values = c.req.valid("json");

      if (!values) {
        return c.json({ error: "Values are required" }, 400);
      }

      const transactionToUpdate = db.$with("transaction_to_update").as(
        db
          .select({ id: transactionsTable.id })
          .from(transactionsTable)
          .innerJoin(
            accountsTable,
            eq(transactionsTable.accountId, accountsTable.id)
          )
          .where(
            and(
              eq(accountsTable.userId, auth.userId),
              eq(transactionsTable.id, values.id)
            )
          )
      );

      const updatedAccount = await db
        .with(transactionToUpdate)
        .update(transactionsTable)
        .set({ ...values })
        .where(
          eq(transactionsTable.id, sql`(SELECT id FROM transaction_to_update)`)
        )
        .returning();

      if (!updatedAccount.length) {
        return c.json({ error: "Failed to edit account" }, 500);
      }

      return c.json({ success: true });
    }
  );

export default app;
