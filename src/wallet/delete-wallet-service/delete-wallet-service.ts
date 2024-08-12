import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WalletEntity } from '../entities/wallet.entity';

@Injectable()
export class DeleteWalletService {
  private readonly logger = new Logger(DeleteWalletService.name);

  constructor(private readonly prisma: PrismaService) {}

  async remove(id: number, authUser: string): Promise<WalletEntity> {
    try {
      const wallet = await this.prisma.wallet.findUnique({
        where: { id },
      });

      if (!wallet || wallet.isDeleted) {
        this.logger.warn(`Wallet with ID ${id} not found or already deleted.`);
        throw new NotFoundException(
          `Wallet with ID ${id} not found or already deleted.`,
        );
      }

      const softDeletedWallet = await this.prisma.wallet.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          deletedBy: authUser,
          isDeleted: true,
        },
      });

      return softDeletedWallet;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage = `An unexpected error occurred while soft deleting the wallet with ID ${id}.`;
      this.logger.error(errorMessage, (error as any).stack);
      throw new InternalServerErrorException(errorMessage);
    }
  }
}
