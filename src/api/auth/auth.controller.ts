import { NextFunction, Request, Response } from "express";
import { TypedRequest } from "../../lib/typed-request.interface";
import { RegisterDto } from "./auth.dto";
import userSrv from '../user/user.service';
import { omit, pick } from 'lodash';
import { UserExistsError } from "../../errors/user-exists.error";
import { WrongCredentialsError } from "../../errors/wrong-credentials.error";
import passport from "passport";
import * as jwt from 'jsonwebtoken';

export const register = async (
    req: TypedRequest<RegisterDto>,
    res: Response,
    next: NextFunction) => {
    try {
        const userData = omit(req.body, 'username', 'password');
        const credentials = pick(req.body, 'username', 'password');

        const newUser = await userSrv.add(userData, credentials);
        // lo yaml prevede 201 per POST /register
        res.status(201);
        res.json(newUser);

    } catch (err) {
        if (err instanceof UserExistsError) {
            res.status(400);
            res.json({
                error: err.name,
                message: err.message
            });
        } else {
            next(err);
        }
    }
}

//Copia e incolla dall'esempio in classe: cambia solo il caso "!user".
//L'esempio risponde 401 con { error: 'LoginError', message: info.message },
//lo yaml per POST /login prevede invece 400 ('Invalid username/password supplied'),
//quindi uso WrongCredentialsError e rispondo come per UserExistsError in register.
export const login = async (
    req: Request,
    res: Response,
    next: NextFunction) => {
    try {
        passport.authenticate('local',
            { session: false },
            (loginErr, user, info) => {

                if (loginErr) {
                    next(loginErr);
                    return;
                }

                if (!user) {
                    const err = new WrongCredentialsError();
                    res.status(400);
                    res.json({
                        error: err.name,
                        message: err.message
                    });
                    return;
                }

                // generare token
                const token = jwt.sign(user, 'my_jwt_secret', { expiresIn: '7 days' })
                res.json({
                    user,
                    token
                });
            }
        )(req, res, next);
    } catch (err) {
        next(err);
    }
}