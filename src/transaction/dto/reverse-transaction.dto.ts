import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class ReverseTransactionDto {
  @IsInt()
  @IsNotEmpty()
  transactionId: number;

  @IsString()
  reason: string;
}
