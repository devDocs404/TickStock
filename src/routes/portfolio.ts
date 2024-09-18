import { Hono } from "hono";
import { z } from "zod";
import { jwt } from "hono/jwt";
import * as portfolioController from "../controllers/portfolioController";
import { JWT_ACCESS_SECRET } from "../constants/auth";

// Initialize Hono instance
const portfolioRouts = new Hono();

// Middleware for JWT authentication
const auth = jwt({ secret: JWT_ACCESS_SECRET });

// Routes
portfolioRouts.post(
  "/basketRecord",
  auth,
  portfolioController.createBasketRecord
);
portfolioRouts.get(
  "/basketRecord",
  auth,
  portfolioController.getBasketsRecords
);

export { portfolioRouts };
