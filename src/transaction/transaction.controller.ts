import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateTransactionService } from './create-transaction/create-transaction.service';
import { ReverseTransactionService } from './reverse-transaction/reverse-transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionEntity } from './entities/transaction.entity';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-config/jwt-auth.guard';
import { RolesGuard } from '../auth/roles-guard/roles.guard';

@Controller('transactions')
@ApiTags('transactions')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TransactionController {
  constructor(
    private readonly createTransactionService: CreateTransactionService,
    private readonly reverseTransactionService: ReverseTransactionService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiBody({ type: CreateTransactionDto })
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Request() req,
  ): Promise<TransactionEntity> {
    const authUserEmail = req.user.email;
    return this.createTransactionService.createTransaction(
      createTransactionDto,
      authUserEmail,
    );
  }

  @Post('reverse/:id')
  @ApiOperation({ summary: 'Reverse a transaction' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the transaction to be reversed',
    example: 1,
    type: Number,
  })
  async reverse(
    @Param('id', ParseIntPipe) transactionId: number,
  ): Promise<void> {
    await this.reverseTransactionService.reverseTransaction(transactionId);
  }
}
