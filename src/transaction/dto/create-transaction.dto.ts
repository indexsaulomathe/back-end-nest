import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  Min,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Type of the transaction, either DEPOSIT or TRANSFER',
    enum: TransactionType,
    example: TransactionType.DEPOSIT,
  })
  @IsNotEmpty({ message: 'Transaction type must not be empty' })
  @IsEnum(TransactionType, { message: 'Invalid transaction type' })
  type: TransactionType;

  @ApiProperty({
    description: 'Amount of the transaction',
    example: 100.0,
    minimum: 0.01,
  })
  @IsNotEmpty({ message: 'Amount must not be empty' })
  @IsNumber({}, { message: 'Amount must be a valid number' })
  @Min(0.01, { message: 'Amount must be greater than zero' })
  amount: number;

  @ApiProperty({
    description:
      'ID of the wallet from which the amount is transferred (required for TRANSFER)',
    example: 1,
    required: false,
  })
  @ValidateIf((o) => o.type === TransactionType.TRANSFER)
  @IsNotEmpty({ message: 'fromWalletId must not be empty for a transfer' })
  @IsInt({ message: 'fromWalletId must be an integer' })
  fromWalletId?: number;

  @ApiProperty({
    description:
      'ID of the wallet to which the amount is transferred (required for TRANSFER)',
    example: 2,
    required: false,
  })
  @ValidateIf((o) => o.type === TransactionType.TRANSFER)
  @IsNotEmpty({ message: 'toWalletId must not be empty for a transfer' })
  @IsInt({ message: 'toWalletId must be an integer' })
  toWalletId?: number;
}
