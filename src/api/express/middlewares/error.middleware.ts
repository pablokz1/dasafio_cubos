import { Request, Response, NextFunction } from 'express';

export function errorMiddleware(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.error('[ErrorMiddleware]', err);

    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    return res.status(status).json({
        error: true,
        message,
    });
}
