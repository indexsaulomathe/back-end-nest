import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'admin@admin.com',
    description: 'E-mail address of the user.',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'admin12345',
    description: 'Password of the user (min length: 6 characters).',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
