//role.middleware.ts: controllo del ruolo a monte 
//(Nel read.me c'è: "api a cui un tipo di utente non può accedere: gradirei un middleware").
//Va messo DOPO isAuthenticated, perché si appoggia su req.user che viene
//popolato dalla strategia jwt (jwt-strategy.ts).
//Lo yaml vuole 404 (non 403) per l'utente col ruolo sbagliato: per questo
//lancio NotFoundError con un messaggio (notFoundHandler lo trasforma in 404).

import { NextFunction, Request, Response } from "express";
import { UserRole } from "../../api/user/user.entity";
import { NotFoundError } from "../../errors/not-found.error";

const hasRole = (role: UserRole, message: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.user!.role !== role) {
            next(new NotFoundError(message));
        } else {
            next();
        }
    }
}

export const isTeacher = hasRole('teacher', "L'utente non è un docente");
export const isStudent = hasRole('student', "L'utente non è uno studente");