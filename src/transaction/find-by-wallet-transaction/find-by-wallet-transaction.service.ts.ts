import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TransactionEntity } from '../entities/transaction.entity';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FindAllByWalletTransactionService {
  private readonly logger = new Logger(FindAllByWalletTransactionService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findByWallet(id: number): Promise<TransactionEntity[]> {
    try {
      const transactions = await this.prisma.transaction.findMany({
        where: { fromWalletId: id, isDeleted: false },
        orderBy: {
          id: 'asc',
        },
      });

      if (!transactions.length) {
        const message = `No transactions found for wallet ID ${id} in the database.`;
        this.logger.warn(message);
        throw new NotFoundException(message);
      }

      return transactions;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage = `An unexpected error occurred while retrieving transactions for wallet ID ${id}.`;
      this.logger.error(`${errorMessage}`, (error as any).stack);
      throw new InternalServerErrorException(errorMessage);
    }
  }
}
