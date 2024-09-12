import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from './jwt.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { DatabaseService } from 'src/database/database.service';
import { BullModule } from '@nestjs/bullmq';
import { EmailProcessor } from './email-processor.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService, JwtStrategy, DatabaseService, EmailProcessor],
  imports: [
    JwtModule.register({
      secret: 'wahala@2024',
      signOptions: {
        expiresIn: '365d'
      }
    }),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379
      }
    }),
    BullModule.registerQueue({
      name: 'email'
    })
  ]
})
export class AuthModule {}
