import { Hono } from "hono";
import { handle } from "hono/vercel";
import categories from "@/features/categories/server/route";
import accounts from "@/features/acounts/server/route";
import transactions from "@/features/transactions/server/route";
import overview from "@/features/overwiev/server/route";

const app = new Hono().basePath("/api");

const routes = app
  .route("/accounts", accounts)
  .route("/categories", categories)
  .route("/overview", overview)
  .route("/transactions", transactions);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);

export type AppType = typeof routes;
