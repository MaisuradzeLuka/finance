import { createClerkClient } from "@clerk/backend";
import { Hono } from "hono";

const expiresInSeconds = 60 * 60 * 24;

const app = new Hono().post("/", async (c) => {
  const clerk = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY!,
  });

  const result = await clerk.signInTokens.createSignInToken({
    userId: process.env.GUEST_USER_ID!,
    expiresInSeconds,
  });

  if (!result.token) {
    return c.json({ error: "Something went wrong" }, 401);
  }

  return c.json(result.token);
});

export default app;
