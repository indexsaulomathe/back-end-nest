import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TransactionEntity } from '../entities/transaction.entity';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FindOneTransactionService {
  private readonly logger = new Logger(FindOneTransactionService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findOne(transactionId: number): Promise<TransactionEntity> {
    try {
      const transaction = await this.prisma.transaction.findUnique({
        where: { id: transactionId, isDeleted: false },
      });

      if (!transaction) {
        const errorMessage = `Transaction with ID ${transactionId} not found.`;
        this.logger.warn(errorMessage);
        throw new NotFoundException(errorMessage);
      }

      return transaction;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage = `An unexpected error occurred while retrieving the transaction with ID ${transactionId}.`;
      this.logger.error(`${errorMessage}`, (error as any).stack);
      throw new InternalServerErrorException(errorMessage);
    }
  }
}
