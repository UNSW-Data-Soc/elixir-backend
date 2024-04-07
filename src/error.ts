import { NextFunction, Request, Response } from "express";

/**
 * Custom error class to handle HTTP errors
 */
class HTTPError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/**
 * Global error handler middleware
 */
export const globalErrorHandler = (err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof HTTPError) {
    res.status(err.status).json({ message: err.message });
  } else {
    res.status(500).json({ message: "Internal server error" });
    console.error(err.message);
  }
};

export default HTTPError;
