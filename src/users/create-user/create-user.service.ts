import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

export const roundsOfHashing = 10;

@Injectable()
export class CreateUserService {
  private readonly logger = new Logger(CreateUserService.name);

  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const authUser = 'tester@teste.com';
      const hashedPassword = await this.hashPassword(createUserDto.password);
      const userData = {
        ...createUserDto,
        password: hashedPassword,
        createdBy: authUser,
      };
      return await this.prisma.user.create({ data: userData });
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`);
      throw error;
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, roundsOfHashing);
  }
}
