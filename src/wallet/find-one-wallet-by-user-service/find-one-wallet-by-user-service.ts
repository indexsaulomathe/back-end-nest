import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { WalletEntity } from '../entities/wallet.entity';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FindOneWalletByUserService {
  private readonly logger = new Logger(FindOneWalletByUserService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: number): Promise<WalletEntity> {
    try {
      const wallet = await this.prisma.wallet.findUnique({
        where: {
          userId: userId,
          isDeleted: false,
        },
      });

      if (!wallet || wallet.isDeleted) {
        this.logger.warn(`No active wallet found for user ID ${userId}.`);
        throw new NotFoundException(
          `No active wallet found for user ID ${userId}.`,
        );
      }

      return wallet;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage = `An unexpected error occurred while retrieving wallet for user ID ${userId}.`;
      this.logger.error(`${errorMessage}`, (error as any).stack);
      throw new InternalServerErrorException(errorMessage);
    }
  }
}
