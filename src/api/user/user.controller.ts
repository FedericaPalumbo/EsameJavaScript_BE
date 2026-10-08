import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../lib/typed-request.interface';
import { QueryUserDto } from './user.dto';
import userSrv from './user.service';

export const list = async (
    req: TypedRequest<unknown, QueryUserDto>,
    res: Response,
    next: NextFunction) => {
    try {
        const results = await userSrv.find(req.query);
        res.json(results);
    } catch (err) {
        next(err);
    }
}