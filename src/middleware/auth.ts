import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { unauthorized, forbidden } from "../utils/response";
import { TokenPayload } from "../types/index";
import { prisma } from "../prisma";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return unauthorized(res, "Need Bearer token in Authorization header");
  }

  const token = authHeader.split(" ")[1]!;

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      return unauthorized(res, "Invalid or expired token");
    }

    req.user = decoded as TokenPayload;
    next();
  });
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return unauthorized(res, "Belum terautentikasi");
    }

    if (!roles.includes(req.user.role)) {
      return forbidden(res, "Akses ditolak: role tidak cukup");
    }

    next();
  };
};
