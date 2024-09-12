import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtService } from "../jwt.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    @Inject(JwtService)
  private readonly jwtService: JwtService;

  constructor(){
    super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'wahala@2024',
        ignoreExpiration: true,
    });
  }
  
}