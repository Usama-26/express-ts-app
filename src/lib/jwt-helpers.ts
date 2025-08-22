import jwt from "jsonwebtoken";
import { ENV } from "../config/env";
import { JWT_ACCESS_EXPIRY, JWT_REFRESH_EXPIRY } from "../config/constants";

const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = ENV;

interface TokenPayload {
  id?: string;
  email?: string;
  type?: string;
}

export const signAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRY,
  });
};

export const signRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRY,
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_ACCESS_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
};
