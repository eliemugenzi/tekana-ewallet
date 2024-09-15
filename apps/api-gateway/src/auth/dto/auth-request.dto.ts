import { ApiProperty } from "@nestjs/swagger";

export class SignUpRequestDto {
    @ApiProperty({example: 'John Doe'})
    fullName: string;
    @ApiProperty({example: 'john.doe@example.com'})
    email: string;
    @ApiProperty({example: 'M'})
    gender: string;
    @ApiProperty({example: '14343354'})
    nationalId: string;
    @ApiProperty({example: 'Test@123'})
    password: string;
}

export class LoginUserRequestDto {
    @ApiProperty({example: 'john.doe@example.com'})
    email: string;
    @ApiProperty({example: 'Test@123'})
    password: string;
  }