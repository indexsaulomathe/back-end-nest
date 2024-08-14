import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';
import bcrypt from 'bcryptjs';

const roundsOfHashing = 10;

@Injectable()
export class UpdateUserService {
  private readonly logger = new Logger(UpdateUserService.name);

  constructor(private readonly prisma: PrismaService) {}

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    authUser: string,
  ): Promise<UserEntity> {
    const existingUser = await this.findUserById(id);

    if (!existingUser || existingUser.isDeleted) {
      this.logger.warn(`User with ID ${id} not found or is deleted.`);
      throw new NotFoundException(
        `User with ID ${id} not found or is deleted.`,
      );
    }

    await this.checkEmailConflict(updateUserDto.email, existingUser.email);

    const hashedPassword =
      updateUserDto.password && updateUserDto.password !== existingUser.password
        ? await this.hashPassword(updateUserDto.password)
        : existingUser.password;

    try {
      return await this.prisma.user.update({
        where: { id },
        data: {
          ...updateUserDto,
          password: hashedPassword,
          updatedAt: new Date(),
          updatedBy: authUser,
        },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      this.logger.error(
        `Error updating user with ID ${id}: ${(error as any).message}`,
        (error as any).stack,
      );
      throw new InternalServerErrorException(
        'An error occurred while updating the user. Please try again later.',
      );
    }
  }

  private async findUserById(id: number): Promise<UserEntity | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  private async checkEmailConflict(
    newEmail: string | undefined,
    existingEmail: string | undefined,
  ): Promise<void> {
    if (newEmail && newEmail !== existingEmail) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: newEmail },
      });

      if (emailExists) {
        this.logger.warn(`Email ${newEmail} is already in use.`);
        throw new ConflictException(`Email ${newEmail} is already in use.`);
      }
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, roundsOfHashing);
  }
}
