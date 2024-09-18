import { Context, Next } from "hono";
import { verify } from "hono/jwt";
import { JWT_ACCESS_SECRET } from "../constants/auth";

export async function jwtMiddleware(c: Context, next: Next) {
  const token = c.req.header("Authorization")?.split(" ")[1];
  if (!token) return c.json({ message: "No token provided" }, 401);

  try {
    const payload = await verify(token, JWT_ACCESS_SECRET);
    c.set("jwtPayload", payload);
    await next();
  } catch (error) {
    return c.json({ message: "Invalid token" }, 401);
  }
}
