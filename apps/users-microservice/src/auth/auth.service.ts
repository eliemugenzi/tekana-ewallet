import { HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { LoginRequestDto, RegisterRequestDto, ValidateTokenDto } from './auth.dto';
import { LoginUserResponse, RegisterUserResponse, ValidateTokenResponse } from './users.pb';
import { JwtService } from './jwt.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    @InjectRepository(User)
    private readonly userRepository: Repository<User>;
    constructor(private readonly jwtService: JwtService, @InjectQueue('email') private readonly emailQueue: Queue) {}
    public async register(payload: RegisterRequestDto): Promise<RegisterUserResponse> {
        // const foundUser = await this.db.user.findFirst({
        //     where: {
        //         email: payload.email
        //     }
        // })

        const foundUser = await this.userRepository.findOne({
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

        // await this.db.user.create({
        //     data: {
        //         ...payload,
        //         password: this.jwtService.encodePassword(payload.password),
        //     }
        // })

        await this.userRepository.create({
            ...payload,
            password: this.jwtService.encodePassword(payload.password),

        }).save()

        this.emailQueue.add('sendEmail', { email: payload.email, subject: 'Account created', message: `Dear ${payload.fullName}, your account has been created!` })

        return {
            status: HttpStatus.CREATED,
            message: 'An account has been created'
        }
    }

    public async login(payload: LoginRequestDto): Promise<LoginUserResponse> {
    //   const foundUser = await this.db.user.findFirst({
    //     where: {
    //         email: payload.email
    //     }
    //   })

    const foundUser = await this.userRepository.findOne({
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

    public async validateToken({ token }: ValidateTokenDto): Promise<ValidateTokenResponse> {
       const decoded = await this.jwtService.verify(token);
       if(!decoded) {
        return {
            status: HttpStatus.FORBIDDEN,
            message: 'Access denied',
            userId: null
        }
       }

       const user = await this.jwtService.validateUser(decoded);
       if(!user) {
        return {
            status: HttpStatus.FORBIDDEN,
            message: 'Access denied',
            userId: null
        }
       }

       return {
        status: HttpStatus.OK,
        message: 'Access granted',
        userId: user.id
       }
    }

}
