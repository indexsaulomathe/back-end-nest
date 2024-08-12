import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { WalletEntity } from '../entities/wallet.entity';
import { CreateWalletDto } from '../dto/create-wallet.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CreateWalletService {
  private readonly logger = new Logger(CreateWalletService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateWalletDto, authUser: string): Promise<WalletEntity> {
    try {
      const existingWallet = await this.prisma.wallet.findUnique({
        where: { userId: data.userId },
      });

      if (existingWallet) {
        this.logger.warn(`A wallet already exists for userId ${data.userId}.`);
        throw new ConflictException(
          `A wallet already exists for userId ${data.userId}.`,
        );
      }

      const createdWallet = await this.prisma.wallet.create({
        data: {
          userId: data.userId,
          balance: data.balance,
          createdAt: new Date(),
          createdBy: authUser,
        },
      });

      return createdWallet;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(
        `Failed to create wallet for userId ${data.userId}`,
        (error as any).stack,
      );
      throw new InternalServerErrorException(
        'An unexpected error occurred while creating the wallet.',
      );
    }
  }
}
