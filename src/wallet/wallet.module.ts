import { Module } from '@nestjs/common';
import { FindOneWalletService } from './find-one-wallet-service/find-one-wallet-service';
import { WalletController } from './wallet.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWalletService } from './create-wallet-service/create-wallet.service';
import { FindAllWalletService } from './find-all-wallet-service/find-all-wallet-service';
import { UpdateWalletService } from './update-wallet-service/update-wallet-service';
import { DeleteWalletService } from './delete-wallet-service/delete-wallet-service';
import { FindOneWalletByUserService } from './find-one-wallet-by-user-service/find-one-wallet-by-user-service';

@Module({
  imports: [],
  controllers: [WalletController],
  providers: [
    FindOneWalletService,
    PrismaService,
    CreateWalletService,
    FindAllWalletService,
    UpdateWalletService,
    DeleteWalletService,
    FindOneWalletByUserService,
  ],
})
export class WalletModule {}
