import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

const app = new Hono().get("/", clerkMiddleware(), async (c) => {
  const auth = getAuth(c);

  if (!auth?.userId) {
    return c.json({ error: "Unauthorised" }, 401);
  }

  try {
    const res = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.userId, auth.userId));

    return c.json(res);
  } catch (error) {
    return c.json({ error: `Internal server error: ${error}` }, 500);
  }
});

export default app;
