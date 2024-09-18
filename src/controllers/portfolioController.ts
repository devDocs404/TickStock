import { Context } from "hono";
import { ConflictError, NotFoundError } from "../utils/errors";
import * as authService from "../services/authService";
import * as PortfolioService from "../services/PortfolioService";

export async function createBasketRecord(c: Context) {
  try {
    const { basketName } = await c.req.json();
    console.log(basketName, "lkajasldkjfaljsdf");

    const userId = c.get("jwtPayload").userId;

    const newBasketRecord = await PortfolioService.createBasketRecord({
      basketName,
      userId,
    });

    return c.json(newBasketRecord, 201);
  } catch (error) {
    const errorResponse = authService.handleError(error);
    return c.json(errorResponse, { status: errorResponse.status });
  }
}

export const getBasketsRecords = async (c: Context) => {
  try {
    const search = c.req.query().search || "";
    const userId = c.get("jwtPayload").userId;
    const stockRecords = await PortfolioService.getStockRecords(userId, search);
    return c.json(
      authService.createStandardResponse({
        status: 200,
        message: "Stock records retrieved successfully",
        success: true,
        data: { baskets: stockRecords },
        links: { self: "/api/stocks/stockRecord" },
      })
    );
  } catch (error) {
    const errorResponse = authService.handleError(error);
    return c.json(errorResponse, { status: errorResponse.status });
  }
};
