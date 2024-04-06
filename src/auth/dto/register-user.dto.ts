import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterUserDto {
    ///reglas de validacion de los parametros

    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @MinLength(6)
    password: string;
}
