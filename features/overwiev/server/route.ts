import { db } from "@/db";
import {
  accountsTable,
  categoriesTable,
  insertSchema,
  transactionsTable,
} from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { and, desc, eq, gte, inArray, lte, sql, sum } from "drizzle-orm";
import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod/v4";
import { format, subDays } from "date-fns";
import { calculateChange } from "@/lib/utils";

const fetchOverviewDataByDate = async (
  from: string,
  to: string,
  userId: string,
) => {
  const transactions = await db
    .select({
      expense:
        sql`SUM(CASE WHEN ${transactionsTable.amount} < 0 THEN ${transactionsTable.amount} ELSE 0 END)`.mapWith(
          Number,
        ),
      income:
        sql`SUM(CASE WHEN ${transactionsTable.amount} >= 0 THEN ${transactionsTable.amount} ELSE 0 END)`.mapWith(
          Number,
        ),
      remaining: sum(transactionsTable.amount).mapWith(Number),
    })
    .from(transactionsTable)
    .innerJoin(accountsTable, eq(transactionsTable.accountId, accountsTable.id))
    .where(
      and(
        eq(accountsTable.userId, userId),
        gte(transactionsTable.date, from),
        lte(transactionsTable.date, to),
      ),
    );

  return transactions[0];
};

const app = new Hono().get("/", clerkMiddleware(), async (c) => {
  const auth = getAuth(c);

  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  const today = format(new Date(), "yyyy-MM-dd");

  const currentFrom = format(subDays(new Date(), 30), "yyyy-MM-dd");
  const currentTo = today;

  const previousFrom = format(subDays(new Date(), 60), "yyyy-MM-dd");
  const previousTo = currentFrom;

  const currentPeriod = await fetchOverviewDataByDate(
    currentFrom,
    currentTo,
    auth.userId,
  );

  const previousPeriod = await fetchOverviewDataByDate(
    previousFrom,
    previousTo,
    auth.userId,
  );

  const remainingChange = calculateChange(
    previousPeriod.remaining,
    currentPeriod.remaining,
  );

  const expenseChange = calculateChange(
    previousPeriod.expense,
    currentPeriod.expense,
  );

  const incomeChange = calculateChange(
    previousPeriod.income,
    currentPeriod.income,
  );

  const transactions = await db
    .select({
      income:
        sql`CASE WHEN ${transactionsTable.amount} >= 0 THEN ${transactionsTable.amount} ELSE 0 END`.mapWith(
          Number,
        ),
      expenses:
        sql`CASE WHEN ${transactionsTable.amount} < 0 THEN ${transactionsTable.amount} ELSE 0 END`.mapWith(
          Number,
        ),
      date: transactionsTable.date,
    })
    .from(transactionsTable)
    .innerJoin(accountsTable, eq(transactionsTable.accountId, accountsTable.id))
    .where(
      and(
        eq(accountsTable.userId, auth.userId),
        gte(transactionsTable.date, currentFrom),
        lte(transactionsTable.date, currentTo),
      ),
    );

  const spendingsByCategory = await db
    .select({
      categoryName: categoriesTable.name,
      total:
        sql`SUM(CASE WHEN ${transactionsTable.amount} < 0 THEN ABS(${transactionsTable.amount}) ELSE 0 END)`.mapWith(
          Number,
        ),
    })
    .from(transactionsTable)
    .innerJoin(accountsTable, eq(transactionsTable.accountId, accountsTable.id))
    .innerJoin(
      categoriesTable,
      eq(transactionsTable.categoryId, categoriesTable.id),
    )
    .where(
      and(
        eq(accountsTable.userId, auth.userId),
        gte(transactionsTable.date, currentFrom),
        lte(transactionsTable.date, currentTo),
      ),
    )
    .groupBy(categoriesTable.id, categoriesTable.name)
    .orderBy(
      desc(
        sql`ABS(SUM (CASE WHEN ${transactionsTable.amount} < 0 THEN ${transactionsTable.amount} ELSE 0 END))`,
      ),
    );

  const topCategories = spendingsByCategory.slice(0, 3);
  const otherCategories = spendingsByCategory.slice(3);
  const otherSum = otherCategories.reduce((acc, curr) => acc + curr.total, 0);

  const formatedCategories = topCategories;
  if (otherCategories.length) {
    formatedCategories.push({ categoryName: "Other", total: otherSum });
  }

  return c.json({
    currentPeriod,
    previousPeriod,
    changes: {
      remainingChange,
      expenseChange,
      incomeChange,
    },
    from: currentFrom,
    to: currentTo,
    transactions,
    spendingsByCategory: formatedCategories,
  });
});

export default app;
