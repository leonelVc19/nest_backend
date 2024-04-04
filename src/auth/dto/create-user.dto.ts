import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    ///reglas de validacion de los parametros

    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @MinLength(6)
    password: string;
}
