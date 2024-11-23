import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Unhandled Error:",err.stack);

  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    error: {
      message: err.message || "An internal server error occurred.",
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};
