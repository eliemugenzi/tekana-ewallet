import { Body, Controller, Inject, OnModuleInit, Post } from '@nestjs/common';
import { LoginUserRequest, LoginUserResponse, RegisterUserRequest, RegisterUserResponse, USER_SERVICE_NAME, UserServiceClient } from './users.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller('auth')
export class AuthController implements OnModuleInit {
    private svc: UserServiceClient;

    @Inject(USER_SERVICE_NAME)
    private readonly client: ClientGrpc;

    public onModuleInit() {
        this.svc = this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
    }

    @Post('signup')
    private async register(@Body() body: RegisterUserRequest): Promise<Observable<RegisterUserResponse>> {
       return this.svc.register(body);
    }

    @Post('login')
    private async login(@Body() body: LoginUserRequest): Promise<Observable<LoginUserResponse>> {
        return this.svc.login(body);
    }
}
