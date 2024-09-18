import { Context } from "hono";
import { validator } from "hono/validator";
import * as authService from "../services/authService";
import {
  UnauthorizedError,
  ConflictError,
  NotFoundError,
  AppError,
} from "../utils/errors";
import { User } from "../interfaces/auth";

export const login = async (c: Context) => {
  try {
    const { email, password } = await c.req.json();

    const user = await authService.findUserByUsername(email);
    if (!user) {
      throw new UnauthorizedError("Invalid credentials", [
        "Invalid email or password",
      ]);
    }

    const isPasswordValid = await authService.validatePassword(
      user as User,
      password
    );
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid credentials", [
        "Invalid username or password",
      ]);
    }

    const tokens = authService.generateTokens({
      userId: (user as User).id,
      email: (user as User).email,
      exp: Math.floor(Date.now() / 1000) + 60 * 1,
    });

    return c.json(
      authService.createStandardResponse({
        status: 200,
        message: "Login successful",
        success: true,
        data: {
          user: {
            id: (user as User).id,
            email: (user as User).email,
            firstName: (user as User).firstName,
            lastName: (user as User).lastName,
            isActive: (user as User).isActive,
          },
          auth: tokens.data,
        },
        links: { self: "/api/login" },
      })
    );
  } catch (error) {
    const errorResponse = authService.handleError(error);
    return c.json(errorResponse, { status: errorResponse.status });
  }
};

export const register = async (c: Context) => {
  try {
    const { email, password, firstName, lastName } = await c.req.json();

    const existingUser = await authService.findUserByUsername(email);
    if (existingUser) {
      throw new ConflictError("Username already exists", [
        "Username is already taken",
      ]);
    }

    const newUser = await authService.createUser(
      email,
      password,
      firstName,
      lastName
    );

    return c.json(newUser, 201);
  } catch (error) {
    const errorResponse = authService.handleError(error);
    return c.json(errorResponse, { status: errorResponse.status });
  }
};

export const refreshToken = async (c: Context) => {
  const { refreshToken } = await c.req.json();
  const payload = authService.verifyRefreshToken(refreshToken);

  if (!payload) {
    return c.json(
      authService.createStandardResponse({
        status: 401,
        message: "Invalid refresh token",
        success: false,
        errors: ["The provided refresh token is invalid or expired"],
        links: { self: "/api/refresh-token" },
      }),
      401
    );
  }

  const tokens = authService.generateTokens({
    userId: payload.userId,
    email: payload.email,
    exp: Math.floor(Date.now() / 1000) + 60 * 1,
  });
  return c.json(tokens);
};

export const getUsers = async (c: Context) => {
  const safeUsers = await authService.getUsers();
  return c.json(
    authService.createStandardResponse({
      status: 200,
      message: "Users retrieved successfully",
      success: true,
      data: { users: safeUsers },
      links: { self: "/api/users" },
    })
  );
};

export const getUserById = async (c: Context) => {
  try {
    const id = c.req.param("id");

    const user = await authService.getUserById(id);
    if (!user) {
      return c.json(
        authService.createStandardResponse({
          status: 404,
          message: "User not found",
          success: false,
          errors: ["No user found with the provided ID"],
          links: { self: `/api/users/${id}` },
        }),
        404
      );
    }

    return c.json(
      authService.createStandardResponse({
        status: 200,
        message: "User retrieved successfully",
        success: true,
        data: { user: user },
        links: { self: `/api/users/${id}` },
      })
    );
  } catch (error) {
    return c.json(authService.handleError(error));
  }
};

export const updateUser = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    const result = await authService.updateUser(id, updates);
    return c.json(result);
  } catch (error) {
    return c.json(authService.handleError(error));
  }
};

export const deleteUser = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const result = await authService.deleteUser(id);
    return c.json(result);
  } catch (error) {
    return c.json(authService.handleError(error));
  }
};
