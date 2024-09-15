import { ApiProperty } from "@nestjs/swagger";

export class RegisterUserResponseDto {
    @ApiProperty({example: 201})
    status: number;
    @ApiProperty({example: 'A user has been registered'})
    message: string;
  }

  export class LoginUserResponseDto {
    @ApiProperty({example: 200})
    status: number;
    @ApiProperty({example: 'A user has been logged in'})
    message: string;
    @ApiProperty({example: 'dsgfgfgfhgghggh'})
    token: string;
  }