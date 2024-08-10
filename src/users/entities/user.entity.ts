import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UserEntity implements User {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the user.',
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user.',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email address of the user.',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'strongpassword',
    description:
      'The password for the user account. It should be at least 8 characters long.',
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    example: ['user', 'admin'],
    description: 'An array of roles assigned to the user.',
  })
  @IsArray()
  @IsString({ each: true })
  roles: string[];

  @ApiProperty({
    example: false,
    description: 'Indicates whether the user account is blocked.',
  })
  @IsBoolean()
  blocked: boolean;

  @ApiProperty({
    example: '2023-07-23T14:48:00.000Z',
    description: 'The date and time when the user was created.',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    example: 'admin',
    description: 'The user who created this account.',
  })
  @IsString()
  createdBy: string;

  @ApiProperty({
    example: '2023-07-23T14:48:00.000Z',
    description: 'The date and time when the user was last updated.',
  })
  @IsDate()
  updatedAt: Date;

  @ApiProperty({
    example: 'admin',
    description: 'The user who last updated this account.',
  })
  @IsString()
  updatedBy: string;

  @ApiProperty({
    example: '2023-07-23T14:48:00.000Z',
    description: 'The date and time when the user was deleted.',
    required: false,
  })
  @IsOptional()
  @IsDate()
  deletedAt: Date;

  @ApiProperty({
    example: 'admin',
    description: 'The user who deleted this account.',
    required: false,
  })
  @IsOptional()
  @IsString()
  deletedBy: string;

  @ApiProperty({
    example: false,
    description: 'Indicates whether the user account is marked as deleted.',
  })
  @IsBoolean()
  isDeleted: boolean;
}
