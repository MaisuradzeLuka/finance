import { db } from "@/db";
import { accountsTable, insertSchema } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod/v4";

const app = new Hono()
  .get("/", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const accounts = await db
      .select()
      .from(accountsTable)
      .where(eq(accountsTable.userId, auth.userId));

    return c.json(accounts);
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

      const account = await db
        .select()
        .from(accountsTable)
        .where(
          and(eq(accountsTable.id, id), eq(accountsTable.userId, auth.userId))
        )
        .limit(1);

      if (!account.length) {
        return c.json({ error: "Account not found" }, 404);
      }

      return c.json(account[0]);
    }
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", insertSchema.pick({ name: true })),
    async (c) => {
      const auth = getAuth(c);

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { name } = c.req.valid("json");

      if (!name) {
        return c.json({ error: "Name is required" }, 400);
      }

      const newAccount = await db
        .insert(accountsTable)
        .values({ name, userId: auth.userId, id: uuidv4() })
        .returning();

      if (!newAccount.length) {
        return c.json({ error: "Failed to create account" }, 500);
      }

      return c.json(newAccount[0]);
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

      const deletedAccounts = await db
        .delete(accountsTable)
        .where(
          and(
            inArray(accountsTable.id, ids),
            eq(accountsTable.userId, auth.userId)
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
    zValidator("json", insertSchema.pick({ name: true, id: true })),
    async (c) => {
      const auth = getAuth(c);

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { id, name } = c.req.valid("json");

      if (!id || !name) {
        return c.json({ error: "ID and Name are required" }, 400);
      }

      const updatedAccount = await db
        .update(accountsTable)
        .set({ id, name })
        .where(
          and(eq(accountsTable.userId, auth.userId), eq(accountsTable.id, id))
        )
        .returning();

      if (!updatedAccount.length) {
        return c.json({ error: "Failed to edit account" }, 500);
      }

      return c.json({ success: true });
    }
  );

export default app;
