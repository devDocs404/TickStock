import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { jwt } from "hono/jwt";
import * as stocksController from "../controllers/stocksController";
import { JWT_ACCESS_SECRET } from "../constants/auth";

const stocksRoutes = new Hono();
const auth = jwt({ secret: JWT_ACCESS_SECRET });
const stockRecordSchema = z.object({
  tickerId: z.string(),
  buyDate: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message: "Invalid date format",
  }),
  buyPrice: z.string(),
  quantity: z.string(),
  brokerName: z.string(),
  userId: z.string().optional(),
});

const updateStockRecordSchema = stockRecordSchema.partial();

// Route to retrieve all stock records for the authenticated user
stocksRoutes.get("/stockRecord", auth, stocksController.getStockRecords);

// Route to retrieve a specific stock record by its ID
stocksRoutes.get("/stockRecord/:id", auth, stocksController.getStockRecordById);

// Route to create a new stock record
stocksRoutes.post("/stockRecord", auth, stocksController.createStockRecord);

// Route to update an existing stock record by its ID
stocksRoutes.patch(
  "/stockRecord/:id",
  auth,
  zValidator("json", updateStockRecordSchema),
  stocksController.updateStockRecord
);

// Route to delete a stock record by its ID
stocksRoutes.delete(
  "/stockRecord/:id",
  auth,
  stocksController.deleteStockRecord
);

// Route to retrieve all ticker records for the authenticated user
stocksRoutes.get("/tickerRecord", auth, stocksController.getTickerRecords);

// // Route to search stocks based on query parameters
// stocksRoutes.get("/search", auth, stocksController.searchStocks);

export { stocksRoutes };
