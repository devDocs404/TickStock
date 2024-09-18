import { createStandardResponse } from "./authService";
import { NotFoundError } from "../utils/errors";
import { db } from "../db";
import { stockRecords, tickerTable } from "../db/schema";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { verify } from "jsonwebtoken";
import {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
} from "../constants/auth";

interface StockRecordInput {
  tickerId: string;
  buyDate: string;
  buyPrice: string;
  quantity: string;
  brokerName: string;
  userId: string;
  basketId: string;
}

// export const verifyRefreshToken = (token: string): TokenPayload | null => {
//   try {
//     return verify(token, JWT_REFRESH_SECRET) as TokenPayload;
//   } catch {
//     return null;
//   }
// };

// Service to get stock records with pagination and search
export async function getStockRecords(
  userId: string,
  page: number,
  size: number,
  search: string
) {
  const offset = (page - 1) * size;

  const searchCondition = search
    ? or(
        ilike(stockRecords.tickerId, `%${search}%`),
        ilike(stockRecords.brokerName, `%${search}%`)
      )
    : undefined;

  const baseQuery = db
    .select({
      id: stockRecords.id,
      userId: stockRecords.userId,
      basketId: stockRecords.basketId,
      tickerId: stockRecords.tickerId,
      buyDate: stockRecords.buyDate,
      buyPrice: stockRecords.buyPrice,
      quantity: stockRecords.quantity,
      brokerName: stockRecords.brokerName,
      createdAt: stockRecords.createdAt,
      updatedAt: stockRecords.updatedAt,
      isActive: stockRecords.isActive,
      count: sql<number>`count(*) over()`,
    })
    .from(stockRecords)
    .where(
      and(
        eq(stockRecords.userId, userId),
        eq(stockRecords.isActive, true),
        searchCondition
      )
    );

  const result = await baseQuery
    .orderBy(desc(stockRecords.createdAt))
    .limit(size)
    .offset(offset);

  const count = result.length > 0 ? result[0].count : 0;

  return {
    items: result.map(({ count, ...row }) => row),
    count,
    offset,
  };
}

// Service to get stock record by ID
export async function getStockRecordById(id: string, userId: string) {
  const [result] = await db
    .select()
    .from(stockRecords)
    .where(and(eq(stockRecords.id, id), eq(stockRecords.userId, userId))) // Combine conditions
    .limit(1);
  return result;
}

// Service to create a new stock record
export const createStockRecord = async ({
  tickerId,
  buyDate,
  buyPrice,
  quantity,
  brokerName,
  userId,
  basketId,
}: StockRecordInput): Promise<any> => {
  // Ensure buyDate is a valid date
  const parsedBuyDate = new Date(buyDate);
  if (isNaN(parsedBuyDate.getTime())) {
    throw new Error("Invalid buyDate");
  }
  // Prepare values to insert
  const values = {
    userId,
    tickerId,
    buyDate: parsedBuyDate,
    buyPrice,
    quantity,
    brokerName,
    basketId: basketId || null,
    isActive: true,
  };

  const newStockRecord = await db
    .insert(stockRecords)
    .values(values as any)
    .returning();

  return createStandardResponse({
    status: 201,
    message: "Stock record created successfully",
    success: true,
    data: { stockRecord: newStockRecord },
    links: { self: "/api/stocks" },
  });
};

// Service to update an existing stock record
export async function updateStockRecord(
  id: string,
  userId: string,
  updates: Partial<Omit<typeof stockRecords.$inferSelect, "id" | "userId">>
) {
  const updatedRecord = await db
    .update(stockRecords)
    .set(updates)
    .where(and(eq(stockRecords.id, id), eq(stockRecords.userId, userId))) // Combine conditions
    .returning();

  if (!updatedRecord.length) {
    throw new NotFoundError("Stock record not found", [
      "No stock record found with the provided ID for this user",
    ]);
  }

  return updatedRecord[0];
}

// Service to delete a stock record
export async function deleteStockRecord(id: string, userId: string) {
  const deletedRecord = await db
    .delete(stockRecords)
    .where(and(eq(stockRecords.id, id), eq(stockRecords.userId, userId))) // Combine conditions
    .returning();

  if (!deletedRecord.length) {
    throw new NotFoundError("Stock record not found", [
      "No stock record found with the provided ID for this user",
    ]);
  }
}

// Service to get ticker records
export const getTickersRecords = async (search?: string) => {
  const result = await db.query.tickerTable.findMany({
    columns: {
      symbolId: true,
      tickerName: true,
      exchange: true,
    },
    where: (fields, operators) => {
      const conditions = [];
      if (search) {
        conditions.push(
          operators.or(
            operators.ilike(fields.symbolId, `%${search}%`),
            operators.ilike(fields.tickerName, `%${search}%`)
          )
        );
      }
      conditions.push(operators.eq(fields.isActive, true)); // Ensure isActive is true
      return operators.and(...conditions);
    },
    limit: 10,
  });

  return result;
};

// export const searchStockService = async (query: string) => {
//   const results = await db
//     .select()
//     .from(tickerTable)
//     .where(
//       or(
//         ilike(tickerTable.symbolId, `%${query}%`), // Case-insensitive search in symbol_id
//         ilike(tickerTable.tickerName, `%${query}%`) // Case-insensitive search in ticker
//       )
//     )
//     .limit(10); // Limit results to 10

//   return results;
// };
