import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { WalletEntity } from '../entities/wallet.entity';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FindOneWalletService {
  private readonly logger = new Logger(FindOneWalletService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findOne(walletId: number): Promise<WalletEntity> {
    try {
      const wallet = await this.prisma.wallet.findUnique({
        where: { id: walletId, isDeleted: false },
      });

      if (!wallet) {
        this.logger.warn(`Wallet with ID ${walletId} not found.`);
        throw new NotFoundException(`Wallet with ID ${walletId} not found.`);
      }

      return wallet;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage = `An unexpected error occurred while retrieving the wallet with ID ${walletId}.`;
      this.logger.error(`${errorMessage}`, (error as any).stack);
      throw new InternalServerErrorException(errorMessage);
    }
  }
}
