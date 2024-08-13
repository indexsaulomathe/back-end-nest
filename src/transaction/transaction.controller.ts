import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Param,
  ParseIntPipe,
  Get,
  Query,
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
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-config/jwt-auth.guard';
import { RolesGuard } from '../auth/roles-guard/roles.guard';
import { Roles } from 'src/auth/roles-guard/roles.decorator';
import { FindOneTransactionService } from './find-one-transaction/find-one-transaction.service';
import { FindAllTransactionService } from './find-all-transaction/find-all-transaction.service';
import { FindAllByWalletTransactionService } from './find-by-wallet-transaction/find-by-wallet-transaction.service.ts';

@Controller('transactions')
@ApiTags('transactions')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TransactionController {
  constructor(
    private readonly createTransactionService: CreateTransactionService,
    private readonly reverseTransactionService: ReverseTransactionService,
    private readonly findOneTransactionService: FindOneTransactionService,
    private readonly findAllTransactionService: FindAllTransactionService,
    private readonly findAllByWalletTransactionService: FindAllByWalletTransactionService,
  ) {}

  @Post()
  @Roles('user')
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
  @Roles('user')
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

  @Get(':id')
  @Roles('user')
  @ApiOperation({ summary: 'Get a transaction by ID' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the transaction',
    example: 1,
    type: Number,
  })
  async findOne(
    @Param('id', ParseIntPipe) transactionId: number,
  ): Promise<TransactionEntity> {
    return await this.findOneTransactionService.findOne(transactionId);
  }

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Get all transactions' })
  async findAll(): Promise<TransactionEntity[]> {
    return await this.findAllTransactionService.findAll();
  }

  @Get('by-wallet/:id')
  @ApiOperation({ summary: 'Get transactions by wallet ID' })
  @ApiQuery({
    name: 'id',
    description: 'Filter transactions by wallet ID',
    required: false,
    type: Number,
  })
  async findAllByWallet(
    @Query('id', ParseIntPipe) id: number,
  ): Promise<TransactionEntity[]> {
    return this.findAllByWalletTransactionService.findByWallet(id);
  }
}
