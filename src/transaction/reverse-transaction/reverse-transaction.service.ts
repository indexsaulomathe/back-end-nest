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

@Injectable()
export class ReverseTransactionService {
  private readonly logger = new Logger(ReverseTransactionService.name);

  constructor(private readonly prisma: PrismaService) {}

  async reverseTransaction(transactionId: number): Promise<void> {
    const transaction = await this.findTransaction(transactionId);
    await this.validateTransactionStatus(transaction);

    try {
      await this.prisma.$transaction(async (prisma) => {
        await this.handleTransactionReversal(this.prisma, transaction);
        await this.updateTransactionStatus(transactionId);
      });
    } catch (error) {
      this.handleException(error);
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

  private async validateTransactionStatus(transaction: any) {
    if (transaction.status !== TransactionStatus.PENDING) {
      this.logger.error(
        `Transaction with ID ${transaction.id} cannot be reversed. Status: ${transaction.status}`,
      );
      throw new BadRequestException(
        `Transaction with ID ${transaction.id} cannot be reversed.`,
      );
    }
  }

  private async handleTransactionReversal(
    prisma: PrismaService,
    transaction: any,
  ) {
    switch (transaction.type) {
      case TransactionType.TRANSFER:
        await this.reverseTransfer(
          prisma,
          new Decimal(transaction.amount),
          transaction.fromWalletId,
          transaction.toWalletId,
        );
        break;
      case TransactionType.DEPOSIT:
        await this.reverseDeposit(
          prisma,
          new Decimal(transaction.amount),
          transaction.fromWalletId,
        );
        break;
      default:
        this.logger.error(
          `Invalid transaction type ${transaction.type} for reversal.`,
        );
        throw new BadRequestException('Invalid transaction type.');
    }
  }

  private async reverseTransfer(
    prisma: PrismaService,
    amount: Decimal,
    fromWalletId: number | null,
    toWalletId: number | null,
  ) {
    await this.validateWallets(prisma, fromWalletId, toWalletId);

    await this.updateWalletBalance(prisma, fromWalletId, amount, 'plus');
    await this.updateWalletBalance(prisma, toWalletId, amount, 'minus');

    this.logger.log(
      `Transfer reversal from wallet ${fromWalletId} to wallet ${toWalletId} completed.`,
    );
  }

  private async reverseDeposit(
    prisma: PrismaService,
    amount: Decimal,
    walletId: number | null,
  ) {
    await this.validateWallet(prisma, walletId);

    await this.updateWalletBalance(prisma, walletId, amount, 'minus');

    this.logger.log(`Deposit reversal for wallet ${walletId} completed.`);
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
      throw new BadRequestException('Wallet ID is required.');
    }

    const wallet = await prisma.wallet.findUnique({ where: { id: walletId } });

    if (!wallet || wallet.isDeleted) {
      throw new NotFoundException(`Wallet with ID ${walletId} not found.`);
    }
  }

  private async updateWalletBalance(
    prisma: PrismaService,
    walletId: number | null,
    amount: Decimal,
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

    const newBalance =
      operation === 'plus'
        ? new Decimal(wallet.balance).plus(amount)
        : new Decimal(wallet.balance).minus(amount);

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

  private handleException(error: any) {
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
