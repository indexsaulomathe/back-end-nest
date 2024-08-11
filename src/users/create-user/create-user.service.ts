import {
  Injectable,
  Logger,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../entities/user.entity';

const ROUNDS_OF_HASHING = 10;

@Injectable()
export class CreateUserService {
  private readonly logger = new Logger(CreateUserService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(
    createUserDto: CreateUserDto,
    authUser: string,
  ): Promise<UserEntity> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        if (existingUser.isDeleted) {
          this.logger.warn(
            `User with email ${createUserDto.email} is deleted.`,
          );
          throw new ConflictException(
            `User with email ${createUserDto.email} is deleted.`,
          );
        }

        this.logger.warn(
          `User with email ${createUserDto.email} already exists.`,
        );
        throw new ConflictException(
          `User with email ${createUserDto.email} already exists.`,
        );
      }

      const hashedPassword = await this.hashPassword(createUserDto.password);
      const userData = {
        ...createUserDto,
        password: hashedPassword,
        createdBy: authUser || 'system',
      };

      return await this.prisma.user.create({ data: userData });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(
        `Error creating user with email ${createUserDto.email}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Error creating user');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, ROUNDS_OF_HASHING);
  }
}
