import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";

const app = new Hono().post("/", clerkMiddleware(), async (c) => {
  const auth = getAuth(c);

  if (!auth?.userId) {
    return c.json({ error: "Unauthorised" }, 401);
  }

  console.log(c);

  // try {
  //   const res = db.insert(usersTable).values();
  // } catch (error) {
  //   return c.json({ error: "Internal server error" }, 500);
  // }
});

export default app;
