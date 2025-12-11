import { Hono } from "hono";
import { handle } from "hono/vercel";
import header from "@/features/header/server/route";
import account from "@/features/account/server/route";

const app = new Hono().basePath("/api");

const routes = app.route("/header", header).route("/account", account);

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;
