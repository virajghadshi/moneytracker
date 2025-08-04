import { transactions, type Transaction, type InsertTransaction } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getTransactions(): Promise<Transaction[]>;
  addTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, transaction: InsertTransaction): Promise<Transaction>;
  deleteTransaction(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getTransactions(): Promise<Transaction[]> {
    return await db.select().from(transactions).orderBy(desc(transactions.date));
  }

  private async recalculateAllBalances(): Promise<void> {
    // Get all transactions ordered by date (oldest first)
    const allTransactions = await db
      .select()
      .from(transactions)
      .orderBy(transactions.date);

    let runningBalance = 0;

    // Calculate running balance for each transaction
    for (const transaction of allTransactions) {
      const amount = parseFloat(transaction.amount);
      const balanceChange = transaction.type === 'cashIn' ? amount : -amount;
      runningBalance += balanceChange;

      // Update the transaction with the correct balance
      await db
        .update(transactions)
        .set({ balance: runningBalance.toFixed(2) })
        .where(eq(transactions.id, transaction.id));
    }
  }

  async addTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    // Insert the new transaction with a temporary balance
    const [transaction] = await db
      .insert(transactions)
      .values({
        ...insertTransaction,
        balance: "0", // Temporary balance
      })
      .returning();
    
    // Recalculate all balances to ensure correct running totals
    await this.recalculateAllBalances();
    
    // Return the transaction with correct balance
    const [updatedTransaction] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, transaction.id));
    
    return updatedTransaction;
  }

  async updateTransaction(id: number, insertTransaction: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db
      .update(transactions)
      .set(insertTransaction)
      .where(eq(transactions.id, id))
      .returning();
    
    // Recalculate all balances after update
    await this.recalculateAllBalances();
    
    // Return the updated transaction with correct balance
    const [updatedTransaction] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id));
    
    return updatedTransaction;
  }

  async deleteTransaction(id: number): Promise<void> {
    await db.delete(transactions).where(eq(transactions.id, id));
    
    // Recalculate all balances after deletion
    await this.recalculateAllBalances();
  }
}

export const storage = new DatabaseStorage();
