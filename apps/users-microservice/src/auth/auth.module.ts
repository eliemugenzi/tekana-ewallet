import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from './jwt.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { DatabaseService } from 'src/database/database.service';
import { BullModule } from '@nestjs/bullmq';
import { EmailProcessor } from './email-processor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService, JwtStrategy, EmailProcessor],
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'wahala@2024',
      signOptions: {
        expiresIn: '365d'
      }
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: 6379,
      }
    }),
    BullModule.registerQueue({
      name: 'email',
      defaultJobOptions: {
        attempts: 5, // Maximum 5 retries
        backoff: {
          type: 'exponential', // Exponential backoff strategy
          delay: 3000 // 3 second delay between the retries
        }
      }
    })
  ]
})
export class AuthModule {}
