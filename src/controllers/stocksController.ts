import { Context } from "hono";
import { ConflictError, NotFoundError } from "../utils/errors";
import * as stocksService from "../services/stocksService";
import * as authService from "../services/authService";
import { verify } from "jsonwebtoken";
import {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
} from "../constants/auth";

// Controller to get all stock records for the authenticated user with pagination
export const getStockRecords = async (c: Context) => {
  const token = c.req.header("Authorization")?.split(" ")[1];
  try {
    verify(token, JWT_ACCESS_SECRET);
  } catch (err) {
    return c.json(
      {
        status: 401,
        message: "Unauthorized",
        token: token,
      },
      { status: 401 }
    );
  }

  try {
    const userId = c.get("jwtPayload").userId;
    const page = parseInt(c.req.query("page") || "1", 10);
    const size = parseInt(c.req.query("size") || "10", 10);
    const search = c.req.query("search") || "";

    const stockRecords = await stocksService.getStockRecords(
      userId,
      page,
      size,
      search
    );

    return c.json(
      authService.createStandardResponse({
        status: 200,
        message: "Stock records retrieved successfully",
        success: true,
        data: {
          stocks: stockRecords.items,
        },
        pagination: {
          count: stockRecords.count,
          currentPage: page,
        },
        links: {
          self: `/api/stocks/stockRecord?page=${page}&size=${size}&search=${search}`,
        },
      })
    );
  } catch (error) {
    const errorResponse = authService.handleError(error);
    return c.json(errorResponse, { status: errorResponse.status });
  }
};

// Controller to get a specific stock record by its ID for the authenticated user
export const getStockRecordById = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const userId = c.get("jwtPayload").userId;
    const stockRecord = await stocksService.getStockRecordById(id, userId);
    if (!stockRecord) {
      throw new NotFoundError("Stock record not found", [
        "No stock record found with the provided ID",
      ]);
    }
    return c.json(
      authService.createStandardResponse({
        status: 200,
        message: "Stock record retrieved successfully",
        success: true,
        data: { stock: stockRecord },
        links: { self: `/api/stocks/stockRecord/${id}` },
      })
    );
  } catch (error) {
    const errorResponse = authService.handleError(error);
    return c.json(errorResponse, { status: errorResponse.status });
  }
};

// Controller to create a new stock record for the authenticated user
export const createStockRecord = async (c: Context) => {
  try {
    const { tickerId, buyDate, buyPrice, quantity, brokerName, basketId } =
      await c.req.json();

    const userId = c.get("jwtPayload").userId;

    const newStockRecord = await stocksService.createStockRecord({
      tickerId,
      buyDate,
      buyPrice,
      quantity,
      brokerName,
      userId,
      basketId,
    });

    return c.json(newStockRecord, 201);
  } catch (error) {
    const errorResponse = authService.handleError(error);
    return c.json(errorResponse, { status: errorResponse.status });
  }
};

// Controller to update an existing stock record for the authenticated user
export const updateStockRecord = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const userId = c.get("jwtPayload").userId;
    const updates = await c.req.json();
    const updatedStockRecord = await stocksService.updateStockRecord(
      id,
      userId,
      updates
    );
    return c.json(
      authService.createStandardResponse({
        status: 200,
        message: "Stock record updated successfully",
        success: true,
        data: { stock: updatedStockRecord },
        links: { self: `/api/stocks/stockRecord/${id}` },
      })
    );
  } catch (error) {
    const errorResponse = authService.handleError(error);
    return c.json(errorResponse, { status: errorResponse.status });
  }
};

// Controller to delete a stock record for the authenticated user
export const deleteStockRecord = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const userId = c.get("jwtPayload").userId;
    await stocksService.deleteStockRecord(id, userId);
    return c.json(
      authService.createStandardResponse({
        status: 200,
        message: "Stock record deleted successfully",
        success: true,
        links: { self: `/api/stocks/stockRecord/${id}` },
      })
    );
  } catch (error) {
    const errorResponse = authService.handleError(error);
    return c.json(errorResponse, { status: errorResponse.status });
  }
};

// Controller to get a list of ticker records for the authenticated user
export const getTickerRecords = async (c: Context) => {
  try {
    const search = c.req.query("search"); // Get 'search' query parameter

    const stockRecords = await stocksService.getTickersRecords(search);

    return c.json(
      authService.createStandardResponse({
        status: 200,
        message: "Stock records retrieved successfully",
        success: true,
        data: { tickers: stockRecords },
        links: { self: "/api/stocks/stockRecord" },
      })
    );
  } catch (error) {
    const errorResponse = authService.handleError(error);
    return c.json(errorResponse, { status: errorResponse.status });
  }
};

// export const searchStocks = async (c: Context) => {
//   const query = c.req.query("q") || ""; // Get the search query from URL params (e.g., ?q=INF)
//   if (!query) {
//     return c.json({ error: "Search query cannot be empty" }, 400);
//   }

//   try {
//     const results = await stocksService.searchStockService(query);
//     return c.json(results, 200);
//   } catch (error) {
//     console.error("Error searching stocks:", error);
//     return c.json({ error: "Internal Server Error" }, 500);
//   }
// };
