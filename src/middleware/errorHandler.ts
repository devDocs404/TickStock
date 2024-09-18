import { MiddlewareHandler } from "hono";

export const errorHandlerMiddleware: MiddlewareHandler = async (c, next) => {
  try {
    await next();
  } catch (err) {
    console.error("Error:", err);
    return c.json({ message: "Internal Server Error" }, 500);
  }
};
