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

  async findByUserId(id: number): Promise<WalletEntity> {
    try {
      const wallet = await this.prisma.wallet.findUnique({
        where: { userId: id, isDeleted: false },
      });

      if (!wallet) {
        this.logger.warn(`No wallet found for user ID ${id}.`);
        throw new NotFoundException(`No wallet found for user ID ${id}.`);
      }

      return wallet;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage = `An unexpected error occurred while retrieving wallet for user ID ${id}.`;
      this.logger.error(`${errorMessage}`, (error as any).stack);
      throw new InternalServerErrorException(errorMessage);
    }
  }
}
