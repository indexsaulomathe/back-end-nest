import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { WalletEntity } from '../entities/wallet.entity';
import { UpdateWalletDto } from '../dto/update-wallet.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UpdateWalletService {
  private readonly logger = new Logger(UpdateWalletService.name);

  constructor(private readonly prisma: PrismaService) {}

  async update(
    walletId: number,
    data: UpdateWalletDto,
    authUser: string,
  ): Promise<WalletEntity> {
    try {
      const updatedWallet = await this.prisma.wallet.update({
        where: { id: walletId },
        data: {
          balance: data.balance,
          updatedAt: new Date(),
          updatedBy: authUser,
        },
      });

      if (!updatedWallet) {
        this.logger.warn(`Wallet with ID ${walletId} not found for update.`);
        throw new NotFoundException(`Wallet with ID ${walletId} not found.`);
      }

      return updatedWallet;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage = `An unexpected error occurred while updating the wallet with ID ${walletId}.`;
      this.logger.error(`${errorMessage}`, (error as any).stack);
      throw new InternalServerErrorException(errorMessage);
    }
  }
}
