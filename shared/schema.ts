import { z } from "zod";
import { pgTable, serial, text, decimal, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// Database schema
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  type: varchar("type", { length: 10 }).notNull(), // 'cashIn' or 'cashOut'
  date: timestamp("date").notNull(),
  balance: decimal("balance", { precision: 10, scale: 2 }).notNull(),
});

// Zod schemas for API validation
export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  balance: true,
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type TimeFilter = "all" | "daily" | "weekly" | "monthly" | "yearly";
