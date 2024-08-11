import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class FindAllUserService {
  private readonly logger = new Logger(FindAllUserService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<UserEntity[]> {
    try {
      const users = await this.prisma.user.findMany({
        where: {
          isDeleted: false,
        },
      });

      return users;
    } catch (error) {
      this.logger.error(`Error finding users: ${error.message}`, error.stack);
      throw error;
    }
  }
}
