// update-user.service.ts

import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserEntity } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UpdateUserService {
  private readonly logger = new Logger(UpdateUserService.name);

  constructor(private readonly prisma: PrismaService) {}

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });

      console.log(updatedUser);

      if (!updatedUser) {
        this.logger.warn(`User with ID ${id} not found.`);
        throw new NotFoundException(`User with ID ${id} not found.`);
      }

      return updatedUser;
    } catch (error) {
      this.logger.error(`Error updating user with ID ${id}: ${error.message}`, error);
      throw error;
    }
  }
}
