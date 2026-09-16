import { NextFunction, Request, Response } from 'express';

export class UnauthorizedError extends Error {
    constructor() {
        super();
        this.message = 'Access token is missing or invalid';
        this.name = 'Unauthorized';
    }
};

export const unauthorizedHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof UnauthorizedError) {
        res.status(401);
        res.json({
            error: err.name,
            message: err.message
        });
    } else {
        next(err);
    }
}