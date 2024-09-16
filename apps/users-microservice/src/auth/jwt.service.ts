import { Injectable } from '@nestjs/common';
import { JwtService as Jwt } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtService {
    @InjectRepository(User)
    private readonly userRepository: Repository<User>;
    constructor(private readonly jwt: Jwt) {}
    public async decode(token: string): Promise<any> {
        return this.jwt.decode(token, null);
    }

    public generateToken(auth: User): string {
        return this.jwt.sign({ 
            id: auth.id,
            email: auth.email,
         })
    }

    public isPasswordValid(password: string, userPassword: string): boolean {
        return bcrypt.compareSync(password, userPassword);
    }

    public encodePassword(password: string): string {
        const salt: string = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    }

    public async verify(token: string): Promise<any> {
        try {
            return this.jwt.verify(token);
        } catch (err) {}
    }

    public async validateUser(decoded: any): Promise<User> {
        // const foundUser = await this.db.user.findFirst({
        //     where: {
        //         id: decoded?.id,
        //     }
        // })

        const foundUser = await this.userRepository.findOne({
            where: {
                id: decoded.id
            }
        })

        return foundUser
    }

}
