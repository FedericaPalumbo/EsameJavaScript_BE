import { IsEmail, IsIn, IsString, IsUrl, Matches } from "class-validator";
import { USER_ROLES, UserRole } from "../user/user.entity";

export class RegisterDto {
    @IsEmail()
    username: string;

    @Matches(
        new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$'),
        {
            message: 'password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character.'
        }
    )
    password: string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsUrl()
    picture: string;

    // nello yaml 'role' è required e può essere solo 'student' o 'teacher'
    @IsIn(USER_ROLES)
    role: UserRole;
}

//Copia e incolla dall'esempio in classe.
//Lo yaml (requestBodies/Login) prevede username e password entrambi required
export class LoginDto {
    @IsEmail()
    username: string;

    @IsString()
    password: string;
}