import { db } from "@/db";
import { categoriesTable, insertCategoriesSchema } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";
import { success, z } from "zod/v4";

const app = new Hono()
  .get("/", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const categories = await db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.userId, auth.userId));

    return c.json(categories);
  })
  .get(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const auth = getAuth(c);

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "ID is required" }, 400);
      }

      const category = await db
        .select()
        .from(categoriesTable)
        .where(
          and(
            eq(categoriesTable.id, id),
            eq(categoriesTable.userId, auth.userId)
          )
        )
        .limit(1);

      if (!category.length) {
        return c.json({ error: "Category not found" }, 404);
      }

      return c.json(category[0]);
    }
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", insertCategoriesSchema.pick({ name: true })),
    async (c) => {
      const auth = getAuth(c);

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { name } = c.req.valid("json");

      if (!name) {
        return c.json({ error: "Name is required" }, 400);
      }

      const newCategory = await db
        .insert(categoriesTable)
        .values({ name, userId: auth.userId, id: uuidv4() })
        .returning();

      if (!newCategory.length) {
        return c.json({ error: "Failed to create category" }, 500);
      }

      return c.json(newCategory[0]);
    }
  )
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator("json", z.object({ ids: z.array(z.string()) })),
    async (c) => {
      const auth = getAuth(c);

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { ids } = c.req.valid("json");

      if (!ids) {
        return c.json({ error: "IDs are required" }, 400);
      }

      const deletedCategories = await db
        .delete(categoriesTable)
        .where(
          and(
            inArray(categoriesTable.id, ids),
            eq(categoriesTable.userId, auth.userId)
          )
        )
        .returning();

      if (!deletedCategories.length) {
        return c.json({ error: "No categories were deleted" }, 500);
      }

      return c.json({ success: true });
    }
  )
  .patch(
    "/",
    clerkMiddleware(),
    zValidator("json", insertCategoriesSchema.pick({ name: true, id: true })),
    async (c) => {
      const auth = getAuth(c);

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { id, name } = c.req.valid("json");

      if (!id || !name) {
        return c.json({ error: "ID and Name are required" }, 400);
      }

      const updatedCategory = await db
        .update(categoriesTable)
        .set({ id, name })
        .where(
          and(
            eq(categoriesTable.userId, auth.userId),
            eq(categoriesTable.id, id)
          )
        )
        .returning();

      if (!updatedCategory.length) {
        return c.json({ error: "Failed to edit category" }, 500);
      }

      return c.json({ success: true });
    }
  );

export default app;
