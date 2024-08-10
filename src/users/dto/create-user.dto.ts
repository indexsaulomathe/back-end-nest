import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user.',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email address of the user. Must be a valid email format.',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'strongpassword',
    description:
      'The password for the user account. It should be strong and secure.',
  })
  @IsString()
  password: string;

  @ApiProperty({
    example: ['user', 'admin'],
    description:
      'An array of roles assigned to the user. Each role represents a different level of access.',
  })
  @IsArray()
  roles: string[];

  @ApiProperty({
    example: false,
    description:
      'A boolean value indicating whether the user account is blocked. Default is false.',
  })
  @IsBoolean()
  blocked: boolean;
}
