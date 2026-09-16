import { NextFunction, Request, Response } from 'express';

export class NotFoundError extends Error {
    constructor(message: string = 'Entity not found') {
        super();
        this.message = message;
        this.name = 'NotFound';
    }
};

export const notFoundHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof NotFoundError) {
        res.status(404);
        res.json({
            error: err.name,
            message: err.message
        });
    } else {
        next(err);
    }
}