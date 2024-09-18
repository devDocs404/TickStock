import { StockRecord } from "../interfaces/auth";
import { createStandardResponse } from "./authService";
import { NotFoundError } from "../utils/errors";
import { db } from "../db";
import { basketRecords } from "../db/schema";
import { and, eq, ilike } from "drizzle-orm";
import { verify } from "hono/jwt";
import { JWT_ACCESS_SECRET } from "../constants/auth";

interface BasketRecordInput {
  basketName: string;
  userId: string;
}

export const createBasketRecord = async ({
  basketName,
  userId,
}: BasketRecordInput): Promise<any> => {
  const newBasketRecord = await db
    .insert(basketRecords)
    .values({
      userId,
      basketName,
    })
    .returning();

  return createStandardResponse({
    status: 201,
    message: "Stock record created successfully",
    success: true,
    data: { stockRecord: [newBasketRecord] },
    links: { self: "/api/portfolio/basketRecord" },
  });
};

export async function getStockRecords(userId: string, search: string) {
  console.log(userId, search, "Muzakkir Top");
  if (search.length === 0) {
    return db
      .select()
      .from(basketRecords)
      .where(eq(basketRecords.userId, userId));
  } else {
    return db
      .select()
      .from(basketRecords)
      .where(
        and(
          eq(basketRecords.userId, userId),
          ilike(basketRecords.basketName, `%${search}%`)
        )
      )
      .limit(10);
  }
}

// export async function getStockRecords(userId: string) {
//   return db.select().from(stockRecords).where(eq(stockRecords.userId, userId));
// }

// export async function getStockRecordById(id: string, userId: string) {
//   const [result] = await db
//     .select()
//     .from(stockRecords)
//     .where(and(eq(stockRecords.id, id), eq(stockRecords.userId, userId))) // Combine conditions
//     .limit(1);
//   return result;
// }

// export async function updateStockRecord(
//   id: string,
//   userId: string,
//   updates: Partial<Omit<typeof stockRecords.$inferSelect, "id" | "userId">>
// ) {
//   const updatedRecord = await db
//     .update(stockRecords)
//     .set(updates)
//     .where(and(eq(stockRecords.id, id), eq(stockRecords.userId, userId))) // Combine conditions
//     .returning();

//   if (!updatedRecord.length) {
//     throw new NotFoundError("Stock record not found", [
//       "No stock record found with the provided ID for this user",
//     ]);
//   }

//   return updatedRecord[0];
// }

// export async function deleteStockRecord(id: string, userId: string) {
//   const deletedRecord = await db
//     .delete(stockRecords)
//     .where(and(eq(stockRecords.id, id), eq(stockRecords.userId, userId))) // Combine conditions
//     .returning();

//   if (!deletedRecord.length) {
//     throw new NotFoundError("Stock record not found", [
//       "No stock record found with the provided ID for this user",
//     ]);
//   }
// }
