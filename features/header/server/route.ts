import { Hono } from "hono";

const app = new Hono().get("/", async (c) => {
  return c.json({ text: true });
});

export default app;
