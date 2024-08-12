import { Controller, Post, Body, Request } from '@nestjs/common';
import { CreateTransactionService } from './create-transaction/create-transaction.service';
import { ReverseTransactionService } from './reverse-transaction/reverse-transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionEntity } from './entities/transaction.entity';

@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly createTransactionService: CreateTransactionService,
    private readonly reverseTransactionService: ReverseTransactionService,
  ) {}

  @Post()
  async createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
    @Request() req,
  ): Promise<TransactionEntity> {
    const authUser = req.user.email;
    return await this.createTransactionService.createTransaction(
      createTransactionDto,
      authUser,
    );
  }

  @Post('reverse')
  async reverseTransaction(@Body() transactionId: number): Promise<void> {
    return await this.reverseTransactionService.reverseTransaction(
      transactionId,
    );
  }
}
