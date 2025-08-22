import { Errback, NextFunction, Request, Response } from "express";

export async function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  res.status(500).json({ status: "failed", message: err.message });
}
