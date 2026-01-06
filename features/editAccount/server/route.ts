import { db } from "@/db";
import { accountsTable, insertSchema } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod/v4";
import { and, eq } from "drizzle-orm";

const app = new Hono()
  .get(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    async (c) => {
      const auth = getAuth(c);

      if (!auth?.userId) {
        return c.json({ error: "Unauthorised" }, 401);
      }

      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing Data" }, 400);
      }

      const accounts = await db
        .select()
        .from(accountsTable)
        .where(
          and(eq(accountsTable.id, id), eq(accountsTable.userId, auth.userId))
        )
        .limit(1);

      if (!accounts[0]) {
        return c.json({ error: "Account not found" }, 404);
      }

      return c.json(accounts[0]);
    }
  )
  .patch(
    "/",
    clerkMiddleware(),
    zValidator("json", insertSchema.pick({ name: true, id: true })),
    async (c) => {
      const auth = getAuth(c);

      if (!auth?.userId) {
        return c.json({ error: "Unauthorised" }, 401);
      }

      const { id, name } = c.req.valid("json");

      if (!id || !name) {
        return c.json({ error: "Missing data" }, 400);
      }

      const updatedValues = await db
        .update(accountsTable)
        .set({ name })
        .where(
          and(eq(accountsTable.id, id), eq(accountsTable.userId, auth.userId))
        )
        .returning();

      if (!updatedValues[0]) {
        return c.json({ error: "Account not found" }, 404);
      }

      return c.json(updatedValues[0]);
    }
  );
// .post(
//   "/",
//   clerkMiddleware(),
//   zValidator("json", insertSchema.pick({ name: true })),
//   async (c) => {
//     const auth = getAuth(c);

//     if (!auth?.userId) {
//       return c.json({ error: "Unauthorised" }, 401);
//     }

//     const body = c.req.valid("json");

//     if (!body.name) {
//       return c.json({ error: "Missing Data" }, 400);
//     }

//     try {
//       const res = await db
//         .insert(accountsTable)
//         .values({ name: body.name, userId: auth.userId, id: uuidv4() })
//         .returning();

//       return c.json(res[0]);
//     } catch (error) {
//       return c.json({ error: `Internal server error: ${error}` }, 500);
//     }
//   }
// );

export default app;
