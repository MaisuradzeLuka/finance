import { Hono } from "hono";
import { handle } from "hono/vercel";
import accountsPage from "@/features/accountPage/server/route";
import editAccount from "@/features/editAccount/server/route";
import categories from "@/features/categories/server/route";
import accounts from "@/features/acounts/server/route";

export const runtime = "edge";

const app = new Hono().basePath("/api");

const routes = app
  .route("/accounts", accounts)
  // .route("/account", account)
  // .route("/accountsPage", accountsPage)
  // .route("/editAccount", editAccount)
  .route("/categories", categories);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);

export type AppType = typeof routes;
