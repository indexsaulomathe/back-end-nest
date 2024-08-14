import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FindOneWalletService } from './find-one-wallet-service/find-one-wallet-service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { JwtAuthGuard } from '../auth/jwt-config/jwt-auth.guard';
import { Roles } from '../auth/roles-guard/roles.decorator';
import { RolesGuard } from '../auth/roles-guard/roles.guard';
import { WalletEntity } from './entities/wallet.entity';
import { CreateWalletService } from './create-wallet-service/create-wallet.service';
import { FindAllWalletService } from './find-all-wallet-service/find-all-wallet-service';
import { UpdateWalletService } from './update-wallet-service/update-wallet-service';
import { DeleteWalletService } from './delete-wallet-service/delete-wallet-service';
import { FindOneWalletByUserService } from './find-one-wallet-by-user-service/find-one-wallet-by-user-service';

@Controller('wallets')
@ApiTags('wallets')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class WalletController {
  constructor(
    private readonly findOneWalletService: FindOneWalletService,
    private readonly createWalletService: CreateWalletService,
    private readonly findAllWalletService: FindAllWalletService,
    private readonly updateWalletService: UpdateWalletService,
    private readonly deleteWalletService: DeleteWalletService,
    private readonly findOneWalletByUserService: FindOneWalletByUserService,
  ) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new wallet' })
  @ApiCreatedResponse({ type: WalletEntity })
  create(
    @Body() createWalletDto: CreateWalletDto,
    @Request() req,
  ): Promise<WalletEntity> {
    const authUser = req.user.email;
    return this.createWalletService.create(createWalletDto, authUser);
  }

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Retrieve all wallets' })
  @ApiOkResponse({ type: WalletEntity, isArray: true })
  findAll(): Promise<WalletEntity[]> {
    return this.findAllWalletService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Retrieve a single wallet by ID' })
  @ApiOkResponse({ type: WalletEntity })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<WalletEntity> {
    return this.findOneWalletService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update a wallet by ID' })
  @ApiOkResponse({ type: WalletEntity })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWalletDto: UpdateWalletDto,
    @Request() req,
  ): Promise<WalletEntity> {
    const authUser = req.user.email;
    return this.updateWalletService.update(id, updateWalletDto, authUser);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a wallet by ID' })
  @ApiOkResponse({ type: WalletEntity })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<WalletEntity> {
    const authUser = req.user.email;
    return this.deleteWalletService.remove(id, authUser);
  }

  @Get('user/:id')
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Retrieve a wallet by user ID' })
  @ApiOkResponse({ type: WalletEntity })
  async findByUserId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<WalletEntity> {
    return await this.findOneWalletByUserService.findByUserId(id);
  }
}
