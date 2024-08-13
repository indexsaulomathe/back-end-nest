import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { TransactionType, TransactionStatus } from '@prisma/client';
import { TransactionEntity } from '../entities/transaction.entity';
import { Decimal } from 'decimal.js';

@Injectable()
export class CreateTransactionService {
  private readonly logger = new Logger(CreateTransactionService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createTransaction(
    data: CreateTransactionDto,
    authUser: string,
  ): Promise<TransactionEntity> {
    this.logger.log('Starting transaction creation process.');

    try {
      return await this.prisma.$transaction(async (prisma) => {
        await this.validateTransactionData(this.prisma, data);
        await this.processTransaction(this.prisma, data);
        const transactionRecord = await this.createTransactionRecord(
          this.prisma,
          data,
          authUser,
        );

        if (!transactionRecord) {
          this.logger.error('Failed to create transaction record.');
          throw new InternalServerErrorException(
            'Transaction creation failed.',
          );
        }

        this.logger.log('Transaction record created successfully.');
        return transactionRecord;
      });
    } catch (error) {
      this.handleException(error);
    }
  }

  private async validateTransactionData(
    prisma: PrismaService,
    data: CreateTransactionDto,
  ) {
    switch (data.type) {
      case TransactionType.TRANSFER:
        await this.validateTransferData(prisma, data);
        break;
      case TransactionType.DEPOSIT:
        await this.validateDepositData(prisma, data);
        break;
      default:
        this.logger.error('Invalid transaction type.');
        throw new BadRequestException('Invalid transaction type.');
    }
  }

  private async validateTransferData(
    prisma: PrismaService,
    data: CreateTransactionDto,
  ) {
    const { amount, fromWalletId, toWalletId } = data;

    if (!fromWalletId || !toWalletId) {
      this.logger.error(
        'Both fromWalletId and toWalletId are required for transfer.',
      );
      throw new BadRequestException(
        'Both fromWalletId and toWalletId are required for transfer.',
      );
    }

    await this.checkWalletExists(prisma, fromWalletId);
    await this.checkWalletExists(prisma, toWalletId);
    await this.checkSufficientBalance(prisma, fromWalletId, amount);
  }

  private async validateDepositData(
    prisma: PrismaService,
    data: CreateTransactionDto,
  ) {
    const { fromWalletId } = data;

    if (!fromWalletId) {
      this.logger.error('fromWalletId is required for deposit.');
      throw new BadRequestException('fromWalletId is required for deposit.');
    }

    await this.checkWalletExists(prisma, fromWalletId);
  }

  private async checkWalletExists(prisma: PrismaService, walletId: number) {
    const wallet = await prisma.wallet.findUnique({
      where: { id: walletId },
    });

    if (!wallet || wallet.isDeleted) {
      this.logger.error(`Wallet with ID ${walletId} not found or is deleted.`);
      throw new NotFoundException(`Wallet with ID ${walletId} not found.`);
    }
  }

  private async checkSufficientBalance(
    prisma: PrismaService,
    walletId: number,
    amount: string,
  ) {
    const wallet = await prisma.wallet.findUnique({
      where: { id: walletId },
    });

    if (!wallet) {
      this.logger.error(`Wallet with ID ${walletId} not found.`);
      throw new NotFoundException(`Wallet with ID ${walletId} not found.`);
    }

    const currentBalance = new Decimal(wallet.balance);
    const transactionAmount = new Decimal(amount);

    if (currentBalance.lessThan(transactionAmount)) {
      this.logger.error('Insufficient balance.');
      throw new BadRequestException('Insufficient balance.');
    }
  }

  private async processTransaction(
    prisma: PrismaService,
    data: CreateTransactionDto,
  ) {
    switch (data.type) {
      case TransactionType.TRANSFER:
        this.logger.log('Processing transfer transaction.');
        await this.handleTransfer(prisma, data);
        break;
      case TransactionType.DEPOSIT:
        this.logger.log('Processing deposit transaction.');
        await this.handleDeposit(prisma, data);
        break;
    }
  }

  private async handleTransfer(
    prisma: PrismaService,
    data: CreateTransactionDto,
  ) {
    const { amount, fromWalletId, toWalletId } = data;

    const decimalAmount = new Decimal(amount);

    await this.updateWalletBalance(
      prisma,
      fromWalletId,
      decimalAmount.negated(),
    );
    await this.updateWalletBalance(prisma, toWalletId, decimalAmount);

    this.logger.log(
      `Transfer from wallet ${fromWalletId} to wallet ${toWalletId} completed.`,
    );
  }

  private async handleDeposit(
    prisma: PrismaService,
    data: CreateTransactionDto,
  ) {
    const { amount, fromWalletId } = data;

    const decimalAmount = new Decimal(amount);

    await this.updateWalletBalance(prisma, fromWalletId, decimalAmount);

    this.logger.log(`Deposit into wallet ${fromWalletId} completed.`);
  }

  private async updateWalletBalance(
    prisma: PrismaService,
    walletId: number | undefined,
    amount: Decimal,
  ) {
    if (!walletId) {
      this.logger.error('Invalid wallet ID.');
      throw new BadRequestException('Invalid wallet ID.');
    }

    const wallet = await prisma.wallet.findUnique({
      where: { id: walletId },
    });

    if (!wallet) {
      this.logger.error(`Wallet with ID ${walletId} not found.`);
      throw new NotFoundException(`Wallet with ID ${walletId} not found.`);
    }

    const currentBalance = new Decimal(wallet.balance);
    const newBalance = currentBalance.add(amount);

    await prisma.wallet.update({
      where: { id: walletId },
      data: { balance: newBalance.toFixed(2) },
    });
  }

  private async createTransactionRecord(
    prisma: PrismaService,
    data: CreateTransactionDto,
    authUser: string,
  ): Promise<TransactionEntity> {
    const { type, amount, fromWalletId, toWalletId } = data;

    const transaction = await prisma.transaction.create({
      data: {
        type,
        amount: new Decimal(amount).toFixed(2),
        fromWalletId: fromWalletId || null,
        toWalletId: toWalletId || null,
        createdBy: authUser,
        status: TransactionStatus.PENDING,
      },
    });

    return transaction as TransactionEntity;
  }

  private handleException(error: any): never {
    if (
      error instanceof BadRequestException ||
      error instanceof NotFoundException
    ) {
      this.logger.warn(error.message);
      throw error;
    }
    this.logger.error('Failed to process transaction', error.stack);
    throw new InternalServerErrorException('Failed to process transaction.');
  }
}
