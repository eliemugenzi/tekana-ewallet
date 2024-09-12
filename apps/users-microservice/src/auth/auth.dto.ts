import { IsEmail, IsString, MinLength } from "class-validator";
import { LoginUserRequest, RegisterUserRequest } from "./users.pb";

export class RegisterRequestDto implements RegisterUserRequest {
    @IsString()
    fullName: string;

    @IsString()
    nationalId: string;

    @IsString()
    gender: 'M' | 'F';

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    public readonly password: string;
    
}

export class LoginRequestDto implements LoginUserRequest {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}