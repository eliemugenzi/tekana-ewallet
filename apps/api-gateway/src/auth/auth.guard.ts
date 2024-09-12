import { CanActivate, ExecutionContext, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { ValidateTokenResponse } from './users.pb';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean | never> {
    const req: Request = context.switchToHttp().getRequest();
    const { authorization } = req.headers;

    if(!authorization) {
      throw new UnauthorizedException();
    }

    const bearer: string[] = authorization.split(' ');

    if(!bearer || bearer?.length !== 2) {
      throw new UnauthorizedException();
    }

    const [, token] = bearer;

    const { status, userId }: ValidateTokenResponse = await this.authService.validate(token);

    if(status !== HttpStatus.OK) {
      throw new UnauthorizedException();
    }
    req['userId'] = userId;
    return true;

  }
}
