import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTransactionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Transaction routes
  app.get("/api/transactions", async (req, res) => {
    try {
      const transactions = await storage.getTransactions();
      res.json(transactions);
    } catch (error) {
      console.error(`Error fetching transactions: ${error}`);
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      // Convert date string to Date object before validation
      const transactionData = {
        ...req.body,
        date: new Date(req.body.date)
      };
      const validatedData = insertTransactionSchema.parse(transactionData);
      const transaction = await storage.addTransaction(validatedData);
      res.status(201).json(transaction);
    } catch (error) {
      console.error(`Error adding transaction:`, error);
      res.status(400).json({ error: "Invalid transaction data" });
    }
  });

  app.put("/api/transactions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid transaction ID" });
      }
      // Convert date string to Date object before validation
      const transactionData = {
        ...req.body,
        date: new Date(req.body.date)
      };
      const validatedData = insertTransactionSchema.parse(transactionData);
      const transaction = await storage.updateTransaction(id, validatedData);
      res.json(transaction);
    } catch (error) {
      console.error(`Error updating transaction:`, error);
      res.status(400).json({ error: "Invalid transaction data" });
    }
  });

  app.delete("/api/transactions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid transaction ID" });
      }
      await storage.deleteTransaction(id);
      res.status(204).send();
    } catch (error) {
      console.error(`Error deleting transaction: ${error}`);
      res.status(500).json({ error: "Failed to delete transaction" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
