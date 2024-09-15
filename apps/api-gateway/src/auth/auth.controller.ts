import { Body, Controller, HttpStatus, Inject, OnModuleInit, Post } from '@nestjs/common';
import { LoginUserRequest, LoginUserResponse, RegisterUserRequest, RegisterUserResponse, USER_SERVICE_NAME, UserServiceClient } from './users.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserRequestDto, SignUpRequestDto } from './dto/auth-request.dto';
import { LoginUserResponseDto, RegisterUserResponseDto } from './dto/auth-response.dto';

@ApiTags("auth")
@Controller('auth')
export class AuthController implements OnModuleInit {
    private svc: UserServiceClient;

    @Inject(USER_SERVICE_NAME)
    private readonly client: ClientGrpc;

    public onModuleInit() {
        this.svc = this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
    }

    @Post('signup')
    @ApiOperation({ summary: 'Create a new user account' })
    @ApiBody({ type: SignUpRequestDto })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'A user has been created', type: RegisterUserResponseDto })
    private async register(@Body() body: RegisterUserRequest): Promise<Observable<RegisterUserResponse>> {
       return this.svc.register(body);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login' })
    @ApiBody({type: LoginUserRequestDto})
    @ApiResponse({status: HttpStatus.OK, description: 'User loggedin', type: LoginUserResponseDto})
    private async login(@Body() body: LoginUserRequest): Promise<Observable<LoginUserResponse>> {
        return this.svc.login(body);
    }
}
