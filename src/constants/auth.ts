export const JWT_ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET || "access-secret-key";
export const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "refresh-secret-key";
export const ACCESS_TOKEN_EXPIRY = Math.floor(Date.now() / 1000) + 60 * 1;
export const REFRESH_TOKEN_EXPIRY = "7d";
