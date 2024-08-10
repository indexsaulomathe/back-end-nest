import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class DeleteUserService {
  private readonly logger = new Logger(DeleteUserService.name);

  constructor(private readonly prisma: PrismaService) {}

  async remove(id: number): Promise<UserEntity> {
    try {
      const deletedUser = await this.prisma.user.delete({
        where: { id },
      });

      if (!deletedUser) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }

      return deletedUser;
    } catch (error) {
      this.logger.error(`Error deleting user with ID ${id}: ${error.message}`);
      throw error;
    }
  }
}
