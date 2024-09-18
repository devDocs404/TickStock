import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { jwt } from "hono/jwt";
import * as authController from "../controllers/authController";
import { JWT_ACCESS_SECRET } from "../constants/auth";
import { jwtMiddleware } from "../middleware/jwtMiddleware";

const authRoutes = new Hono();

// Schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const registerSchema = loginSchema.extend({
  firstName: z.string(),
  lastName: z.string(),
});

// Middleware
const auth = jwt({ secret: JWT_ACCESS_SECRET });

// Routes
authRoutes.post(
  "/login",
  zValidator("json", loginSchema),
  authController.login
);
authRoutes.post(
  "/register",
  zValidator("json", registerSchema),
  authController.register
);
authRoutes.post("/refresh-token", authController.refreshToken);
// authRoutes.get("/protected", auth, authController.getProtected);
authRoutes.get("/users", auth, authController.getUsers);
authRoutes.get("/users/:id", auth, authController.getUserById);
authRoutes.put("/users/:id", jwtMiddleware, authController.updateUser);
authRoutes.delete("/users/:id", jwtMiddleware, authController.deleteUser);

export { authRoutes };
