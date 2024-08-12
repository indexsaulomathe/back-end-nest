import { Module } from '@nestjs/common';
import { CreateTransactionService } from './create-transaction/create-transaction.service';
import { TransactionController } from './transaction.controller';
import { ReverseTransactionService } from './reverse-transaction/reverse-transaction.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [TransactionController],
  providers: [
    CreateTransactionService,
    ReverseTransactionService,
    PrismaService,
  ],
})
export class TransactionModule {}
