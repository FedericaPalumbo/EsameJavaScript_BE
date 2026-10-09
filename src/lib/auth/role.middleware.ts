//role.middleware.ts: controllo del ruolo a monte 
//(Nel read.me c'è: "api a cui un tipo di utente non può accedere: gradirei un middleware").
//Va messo DOPO isAuthenticated, perché si appoggia su req.user che viene
//popolato dalla strategia jwt (jwt-strategy.ts).
//Lo yaml vuole 404 (non 403) per l'utente col ruolo sbagliato: per questo
//lancio NotFoundError con un messaggio (notFoundHandler lo trasforma in 404).

import { NextFunction, Response } from "express";
import { TypedRequest } from "../typed-request.interface";
import { UserRole } from "../../api/user/user.entity";
import { NotFoundError } from "../../errors/not-found.error";

// req è TypedRequest<any, any, any> (come l'implementazione di validate): con Request "nudo" TypeScript
// fissa params a ParamsDictionary per tutta la catena e i controller con params tipizzati (es. ClassroomIdParams) non compilano
const hasRole = (role: UserRole, message: string) => {
    return (req: TypedRequest<any, any, any>, res: Response, next: NextFunction) => {
        if (req.user!.role !== role) {
            next(new NotFoundError(message));
        } else {
            next();
        }
    }
}

export const isTeacher = hasRole('teacher', "L'utente non è un docente");
export const isStudent = hasRole('student', "L'utente non è uno studente");