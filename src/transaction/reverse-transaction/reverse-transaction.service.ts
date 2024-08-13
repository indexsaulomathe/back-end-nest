import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TransactionType, TransactionStatus } from '@prisma/client';
import { Decimal } from 'decimal.js';
import { TransactionEntity } from '../entities/transaction.entity';

@Injectable()
export class ReverseTransactionService {
  private readonly logger = new Logger(ReverseTransactionService.name);

  constructor(private readonly prisma: PrismaService) {}

  async reverseTransaction(transactionId: number): Promise<TransactionEntity> {
    const transaction = await this.findTransaction(transactionId);
    this.validateTransactionStatus(transaction);

    try {
      await this.prisma.$transaction(async (prisma) => {
        await this.handleTransactionReversal(this.prisma, transaction);
        await this.updateTransactionStatus(transactionId);
      });
      return await this.findTransaction(transactionId);
    } catch (error) {
      return this.handleException(error);
    }
  }

  private async findTransaction(transactionId: number) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      this.logger.error(`Transaction with ID ${transactionId} not found.`);
      throw new NotFoundException(
        `Transaction with ID ${transactionId} not found.`,
      );
    }

    return transaction;
  }

  private validateTransactionStatus(transaction: any) {
    if (transaction.status !== TransactionStatus.COMPLETED) {
      this.logger.error(
        `Transaction with ID ${transaction.id} cannot be reversed. Status: ${transaction.status}`,
      );
      throw new BadRequestException(
        `Transaction with ID ${transaction.id} cannot be reversed. Status: ${transaction.status}`,
      );
    }
  }

  private async handleTransactionReversal(
    prisma: PrismaService,
    transaction: any,
  ) {
    switch (transaction.type) {
      case TransactionType.TRANSFER:
        await this.reverseTransfer(prisma, transaction);
        break;
      case TransactionType.DEPOSIT:
        await this.reverseDeposit(prisma, transaction);
        break;
      default:
        this.logger.error(
          `Invalid transaction type ${transaction.type} for reversal.`,
        );
        throw new BadRequestException('Invalid transaction type.');
    }
  }

  private async reverseTransfer(prisma: PrismaService, transaction: any) {
    await this.validateWallets(
      prisma,
      transaction.fromWalletId,
      transaction.toWalletId,
    );
    await this.updateWalletBalance(
      prisma,
      transaction.fromWalletId,
      transaction.amount,
      'plus',
    );
    await this.updateWalletBalance(
      prisma,
      transaction.toWalletId,
      transaction.amount,
      'minus',
    );
    this.logger.log(
      `Transfer reversal from wallet ${transaction.fromWalletId} to wallet ${transaction.toWalletId} completed.`,
    );
  }

  private async reverseDeposit(prisma: PrismaService, transaction: any) {
    await this.validateWallet(prisma, transaction.fromWalletId);
    await this.updateWalletBalance(
      prisma,
      transaction.fromWalletId,
      transaction.amount,
      'minus',
    );
    this.logger.log(
      `Deposit reversal for wallet ${transaction.fromWalletId} completed.`,
    );
  }

  private async validateWallets(
    prisma: PrismaService,
    fromWalletId: number | null,
    toWalletId: number | null,
  ) {
    await Promise.all([
      this.validateWallet(prisma, fromWalletId),
      this.validateWallet(prisma, toWalletId),
    ]);
  }

  private async validateWallet(prisma: PrismaService, walletId: number | null) {
    if (walletId === null) {
      this.logger.error('Wallet ID is required.');
      throw new BadRequestException('Wallet ID is required.');
    }

    const wallet = await prisma.wallet.findUnique({ where: { id: walletId } });

    if (!wallet || wallet.isDeleted) {
      this.logger.error(`Wallet with ID ${walletId} not found.`);
      throw new NotFoundException(`Wallet with ID ${walletId} not found.`);
    }
  }

  private async updateWalletBalance(
    prisma: PrismaService,
    walletId: number | null,
    amount: string,
    operation: 'plus' | 'minus',
  ) {
    if (walletId === null) {
      this.logger.error('Wallet ID is required to update balance.');
      throw new BadRequestException('Wallet ID is required to update balance.');
    }

    const wallet = await prisma.wallet.findUnique({ where: { id: walletId } });

    if (!wallet || wallet.isDeleted) {
      this.logger.error(`Wallet with ID ${walletId} not found.`);
      throw new NotFoundException(`Wallet with ID ${walletId} not found.`);
    }

    const currentBalance = new Decimal(wallet.balance);
    const decimalAmount = new Decimal(amount);

    const newBalance =
      operation === 'plus'
        ? currentBalance.plus(decimalAmount)
        : currentBalance.minus(decimalAmount);

    await prisma.wallet.update({
      where: { id: walletId },
      data: { balance: newBalance.toFixed(2) },
    });
  }

  private async updateTransactionStatus(transactionId: number) {
    await this.prisma.transaction.update({
      where: { id: transactionId },
      data: { status: TransactionStatus.REVERSED },
    });
  }

  private handleException(error: any): never {
    if (
      error instanceof BadRequestException ||
      error instanceof NotFoundException
    ) {
      this.logger.warn(error.message);
      throw error;
    }
    this.logger.error('Failed to reverse transaction', error.stack);
    throw new InternalServerErrorException('Failed to reverse transaction.');
  }
}
