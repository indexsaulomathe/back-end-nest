import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class DeleteUserService {
  private readonly logger = new Logger(DeleteUserService.name);

  constructor(private readonly prisma: PrismaService) {}

  async remove(id: number, authUser: string): Promise<UserEntity> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id, isDeleted: false },
      });

      if (!user) {
        this.logger.warn(`User with ID ${id} not found or already deleted.`);
        throw new NotFoundException(
          `User with ID ${id} not found or already deleted.`,
        );
      }

      const softDeletedUser = await this.prisma.user.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
          deletedBy: authUser || 'system',
        },
      });

      return softDeletedUser;
    } catch (error) {
      this.logger.error(
        `Error soft deleting user with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
