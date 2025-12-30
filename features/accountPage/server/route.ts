import { db } from "@/db";
import { accountsTable } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { and, eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { success, z } from "zod/v4";

const app = new Hono()
  .get("/", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json({ error: "Unauthorised" }, 401);
    }

    try {
      const res = await db
        .select()
        .from(accountsTable)
        .where(eq(accountsTable.userId, auth.userId));

      return c.json(res);
    } catch (error) {
      return c.json({ error: `Internal server error: ${error}` }, 500);
    }
  })
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator("json", z.object({ ids: z.array(z.string()) })),
    async (c) => {
      const auth = getAuth(c);

      if (!auth?.userId) {
        return c.json({ error: "Unauthorised" }, 401);
      }

      const { ids } = c.req.valid("json");

      if (!ids.length) {
        return c.json({ error: "No IDs provided" }, 400);
      }

      try {
        await db
          .delete(accountsTable)
          .where(
            and(
              eq(accountsTable.userId, auth.userId),
              inArray(accountsTable.id, ids)
            )
          );

        return c.json({ success: true });
      } catch (error) {
        return c.json({ error: `Internal server error: ${error}` }, 500);
      }
    }
  );

export default app;
