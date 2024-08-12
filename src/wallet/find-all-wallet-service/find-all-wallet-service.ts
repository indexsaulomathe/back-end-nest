import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { WalletEntity } from '../entities/wallet.entity';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FindAllWalletService {
  private readonly logger = new Logger(FindAllWalletService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<WalletEntity[]> {
    try {
      const wallets = await this.prisma.wallet.findMany({
        where: { isDeleted: false },
        orderBy: {
          id: 'asc',
        },
      });

      if (!wallets.length) {
        this.logger.warn('No wallets found in the database.');
        throw new NotFoundException('No wallets found in the database.');
      }

      return wallets;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage =
        'An unexpected error occurred while retrieving wallets.';
      this.logger.error(`${errorMessage}`, (error as any).stack);
      throw new InternalServerErrorException(errorMessage);
    }
  }
}
