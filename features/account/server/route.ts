import { db } from "@/db";
import { accountsTable, insertSchema } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { v4 as uuidv4 } from "uuid";

const app = new Hono().post(
  "/",
  clerkMiddleware(),
  zValidator("json", insertSchema.pick({ name: true })),
  async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json({ error: "Unauthorised" }, 401);
    }

    const body = c.req.valid("json");

    if (!body.name) {
      return c.json({ error: "Missing Data" }, 400);
    }

    try {
      const res = await db
        .insert(accountsTable)
        .values({ name: body.name, userId: auth.userId, id: uuidv4() })
        .returning();

      return c.json(res[0]);
    } catch (error) {
      return c.json({ error: `Internal server error: ${error}` }, 500);
    }
  }
);

export default app;
