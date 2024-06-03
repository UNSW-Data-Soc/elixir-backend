import { NextFunction, Request, Response, RequestHandler } from "express";

/**
 * Wraps the given HTML content in a body tag with some default styles.
 */
export function wrapHTML(html: string) {
  return `<body style="padding:20px;font-family:sans-serif;height:100vh;">
            ${html}</body>`;
}

// wrap async functions to catch errors
export const asyncHandler =
  (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
