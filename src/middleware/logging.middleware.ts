import { Request, Response } from 'express';


export function loggerMiddleware(
    req: Request,
    res: Response,
    next: Function
): any {
   console.debug(`[NEST] ${new Date().toString()} [${req.method}]   ${req.originalUrl}`);
    next();
}
