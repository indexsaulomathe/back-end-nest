import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class FindOneUserService {
  private readonly logger = new Logger(FindOneUserService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: number): Promise<UserEntity> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id, isDeleted: false },
      });

      if (!user) {
        this.logger.warn(`User with ID ${id} not found.`);
        throw new NotFoundException(`User with ID ${id} not found.`);
      }

      return user;
    } catch (error) {
      this.logger.error(
        `Error finding user with ID ${id}: ${(error as any).message}`,
      );
      throw error;
    }
  }
}
