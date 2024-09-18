import { sign, verify } from "jsonwebtoken";
import { User, TokenPayload } from "../interfaces/auth";
import {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
} from "../constants/auth";
import * as bcrypt from "bcrypt";
import { AppError, NotFoundError } from "../utils/errors";
import { db, supabase } from "../db";
import { stockRecords, users } from "../db/schema";
import { Column, eq } from "drizzle-orm";

export const findUserByUsername = async (email: string) => {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return result[0];
};

export function createStandardResponse(options: {
  status: number;
  message: string;
  success: boolean;
  data?: any;
  errors?: any;
  pagination?: any;
  links?: { [key: string]: string };
}) {
  const { status, message, success, data, errors, pagination, links } = options;
  console.log(links, "links");
  return {
    status,
    message,
    success,
    data: data || null,
    metadata: {
      timestamp: new Date().toISOString(),
      serverTime: new Date().toISOString(),
    },
    pagination: pagination || null,
    errors: errors || null,
    links: links || { self: "" },
  };
}

export function handleError(error: unknown) {
  if (error instanceof AppError) {
    return createStandardResponse({
      status: error.statusCode,
      message: error.message,
      success: false,
      errors: error.errors,
    });
  } else if (error instanceof Error) {
    return createStandardResponse({
      status: 500,
      message: "Internal Server Error",
      success: false,
      errors: [error.message],
    });
  } else {
    return createStandardResponse({
      status: 500,
      message: "Unknown Error",
      success: false,
      errors: ["An unknown error occurred"],
    });
  }
}

export const generateTokens = (payload: TokenPayload) => {
  const accessToken = sign(payload, JWT_ACCESS_SECRET);
  const refreshToken = sign(payload, JWT_REFRESH_SECRET);
  return createStandardResponse({
    status: 200,
    message: "Tokens generated successfully",
    success: true,
    data: {
      accessToken,
      refreshToken,
      tokenType: "Bearer",
      expiresIn: ACCESS_TOKEN_EXPIRY,
    },
    links: { self: "/api/token" },
  });
};

export const verifyRefreshToken = (token: string): TokenPayload | null => {
  try {
    return verify(token, JWT_REFRESH_SECRET) as TokenPayload;
  } catch {
    return null;
  }
};

export const createUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<any> => {
  const hashedPassword = await bcrypt.hash(password, 15);
  console.log("Comming till Here");
  const newUser = await db
    .insert(users)
    .values({
      email,
      firstName,
      lastName,
      password: hashedPassword,
    })
    .returning();

  return createStandardResponse({
    status: 201,
    message: "User created successfully",
    success: true,
    data: { user: { ...newUser[0], password: undefined } },
    links: { self: "/api/users" },
  });
};

export const validatePassword = async (
  user: User,
  password: string
): Promise<boolean> => {
  return bcrypt.compare(password, user.password);
};

export const getUsers = async () => {
  const result = await db.query.users.findMany({
    columns: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      isActive: true,
    },
    with: {
      stockRecords: {
        columns: {
          id: true,
          buyDate: true,
          buyPrice: true,
          quantity: true,
          brokerName: true,
        },
        with: {
          ticker: {
            columns: {
              symbolId: true,
              tickerName: true,
              exchange: true,
            },
          },
        },
      },
    },
  });

  return {
    status: 200,
    message: "Users retrieved successfully",
    success: true,
    data: {
      users: result,
    },
    metadata: {
      timestamp: new Date().toISOString(),
      serverTime: new Date().toISOString(),
    },
    links: {
      self: "/api/users",
    },
  };
};
export const getUserById = async (id: string) => {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0];
};

export const updateUser = async (
  id: string,
  updates: Partial<Omit<User, "id" | "password">>
): Promise<any> => {
  const updatedUser = await db
    .update(users)
    .set(updates)
    .where(eq(users.id, id))
    .returning();

  if (!updatedUser.length) {
    throw new NotFoundError("User not found", [
      "No user found with the provided ID",
    ]);
  }

  const { password, ...safeUser } = updatedUser[0];

  return createStandardResponse({
    status: 200,
    message: "User updated successfully",
    success: true,
    data: { user: safeUser },
    links: { self: `/api/users/${id}` },
  });
};

export const deleteUser = async (id: string): Promise<any> => {
  const deletedUser = await db
    .delete(users)
    .where(eq(users.id, id))
    .returning();

  if (!deletedUser.length) {
    throw new NotFoundError("User not found", [
      "No user found with the provided ID",
    ]);
  }

  return createStandardResponse({
    status: 200,
    message: "User deleted successfully",
    success: true,
    links: { self: `/api/users/${id}` },
  });
};
