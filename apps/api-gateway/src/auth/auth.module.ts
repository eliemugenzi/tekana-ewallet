import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_SERVICE_NAME, USERS_PACKAGE_NAME } from './users.pb';
import { AuthController } from './auth.controller';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([{
      name: USER_SERVICE_NAME,
      transport: Transport.GRPC,
      options: {
        package: USERS_PACKAGE_NAME,
        protoPath: 'node_modules/tew-protos/users.proto',
        url: `${process.env.URL}:${process.env.USERS_PORT}`
      }
    }])
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
