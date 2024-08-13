import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TransactionEntity } from '../entities/transaction.entity';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FindAllTransactionService {
  private readonly logger = new Logger(FindAllTransactionService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<TransactionEntity[]> {
    try {
      const transactions = await this.prisma.transaction.findMany({
        where: { isDeleted: false },
        orderBy: {
          id: 'asc',
        },
      });

      if (!transactions.length) {
        const message = 'No transactions found in the database.';
        this.logger.warn(message);
        throw new NotFoundException(message);
      }

      return transactions;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage =
        'An unexpected error occurred while retrieving transactions.';
      this.logger.error(`${errorMessage}`, (error as any).stack);
      throw new InternalServerErrorException(errorMessage);
    }
  }
}
