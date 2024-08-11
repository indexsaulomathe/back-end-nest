import {
  Injectable,
  NotFoundException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

export const roundsOfHashing = 10;

@Injectable()
export class UpdateUserService {
  private readonly logger = new Logger(UpdateUserService.name);

  constructor(private readonly prisma: PrismaService) {}

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    authUser: string,
  ): Promise<UserEntity> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { id, isDeleted: false },
      });

      if (!existingUser) {
        this.logger.warn(`User with ID ${id} not found.`);
        throw new NotFoundException(`User with ID ${id} not found.`);
      }

      let hashedPassword: string | undefined = undefined;
      if (
        updateUserDto.password &&
        updateUserDto.password !== existingUser.password
      ) {
        hashedPassword = await this.hashPassword(updateUserDto.password);
      }

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          ...updateUserDto,
          password: hashedPassword ?? existingUser.password,
          updatedAt: new Date(),
          updatedBy: authUser,
        },
      });

      return updatedUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Error updating user with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'An error occurred while updating the user.',
      );
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, roundsOfHashing);
  }
}
