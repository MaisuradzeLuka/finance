import { Hono } from "hono";
import { handle } from "hono/vercel";
import header from "@/features/header/server/route";
import account from "@/features/account/server/route";
import accountsPage from "@/features/accountPage/server/route";

export const runtime = "edge";

const app = new Hono().basePath("/api");

const routes = app
  .route("/header", header)
  .route("/account", account)
  .route("/accountsPage", accountsPage);

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;
