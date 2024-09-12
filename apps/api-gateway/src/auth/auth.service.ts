import { Inject, Injectable } from '@nestjs/common';
import { USER_SERVICE_NAME, UserServiceClient } from './users.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
    private svc: UserServiceClient;

    @Inject(USER_SERVICE_NAME)
    private readonly client: ClientGrpc;

    public onModuleInit(): void {
        this.svc = this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
    }

    public async validate(token: string): Promise<any> {
     return firstValueFrom(this.svc.validateToken({ token }));
    }
}
