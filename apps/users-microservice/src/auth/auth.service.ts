import { HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { LoginRequestDto, RegisterRequestDto } from './auth.dto';
import { LoginUserResponse, RegisterUserResponse } from './users.pb';
import { JwtService } from './jwt.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class AuthService {
    constructor(private readonly db: DatabaseService, private readonly jwtService: JwtService, @InjectQueue('email') private readonly emailQueue: Queue) {}
    public async register(payload: RegisterRequestDto): Promise<RegisterUserResponse> {
        const foundUser = await this.db.user.findFirst({
            where: {
                email: payload.email
            }
        })

        if(foundUser) {
            return {
                status: HttpStatus.CONFLICT,
                message: 'Email already exists'
            }
        }

        await this.db.user.create({
            data: {
                ...payload,
                password: this.jwtService.encodePassword(payload.password),
            }
        })

        this.emailQueue.add('sendEmail', { email: payload.email, subject: 'Account created', message: `Dear ${payload.fullName}, your account has been created!` })

        return {
            status: HttpStatus.CREATED,
            message: 'An account has been created'
        }
    }

    public async login(payload: LoginRequestDto): Promise<LoginUserResponse> {
      const foundUser = await this.db.user.findFirst({
        where: {
            email: payload.email
        }
      })

      if(!foundUser) {
        return {
            status: HttpStatus.BAD_REQUEST,
            message: 'Invalid credentials',
            token: null
        }
      }

      const isPasswordValid = this.jwtService.isPasswordValid(payload.password, foundUser.password);
      if(!isPasswordValid) {
        return {
            status: HttpStatus.BAD_REQUEST,
            message: 'Invalid Credentials',
            token: null,
        }
      }

      const token = this.jwtService.generateToken(foundUser);
      return {
        status: HttpStatus.OK,
        token,
        message: 'Login successful!'
      }
    }

}
