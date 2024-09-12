import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GrpcMethod } from '@nestjs/microservices';
import { LoginUserResponse, RegisterUserResponse, USER_SERVICE_NAME, ValidateTokenResponse } from './users.pb';
import { LoginRequestDto, RegisterRequestDto, ValidateTokenDto } from './auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @GrpcMethod(USER_SERVICE_NAME, "Register")
    private register(payload: RegisterRequestDto): Promise<RegisterUserResponse> {
        return this.authService.register(payload);
    }

    @GrpcMethod(USER_SERVICE_NAME, 'Login')
    private login(payload: LoginRequestDto): Promise<LoginUserResponse> {
        return this.authService.login(payload);
    }

    @GrpcMethod(USER_SERVICE_NAME, "ValidateToken")
    private validateToken(payload: ValidateTokenDto): Promise<ValidateTokenResponse> {
        return this.authService.validateToken(payload);
    }

}
