import { Module } from '@nestjs/common';
import { CreateTransactionService } from './create-transaction/create-transaction.service';
import { TransactionController } from './transaction.controller';
import { ReverseTransactionService } from './reverse-transaction/reverse-transaction.service';
import { PrismaService } from '../prisma/prisma.service';
import { FindOneTransactionService } from './find-one-transaction/find-one-transaction.service';
import { FindAllTransactionService } from './find-all-transaction/find-all-transaction.service';
import { FindAllByWalletTransactionService } from './find-by-wallet-transaction/find-by-wallet-transaction.service.ts';

@Module({
  controllers: [TransactionController],
  providers: [
    CreateTransactionService,
    ReverseTransactionService,
    PrismaService,
    FindOneTransactionService,
    FindAllTransactionService,
    FindAllByWalletTransactionService,
  ],
})
export class TransactionModule {}
