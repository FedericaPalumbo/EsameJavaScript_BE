//Il DTO serve a validare ciò che arriva dal client (query, body o params).
//In questo caso GET /users?type= riceve un parametro e lo yaml prevede 400 se non è valido, quindi devo realizzare il DTO
//Lo uso in tre punti: validate(QueryUserDto, 'query') nel router, TypedRequest<unknown, QueryUserDto> nel controller e find(filters: QueryUserDto) nel service.

import { IsIn } from "class-validator";
import { USER_ROLES, UserRole } from "./user.entity";

export class QueryUserDto {
    @IsIn(USER_ROLES)
    type: UserRole;
}