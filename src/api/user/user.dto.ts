import { IsIn } from "class-validator";
import { USER_ROLES, UserRole } from "./user.entity";

export class QueryUserDto {
    @IsIn(USER_ROLES)
    type: UserRole;
}

//Perchè qui abbiamo avuto la neccessità di creare un user.dto quando in api_server di battistaar non c'è?