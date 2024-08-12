import { Wallet } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class WalletEntity implements Wallet {
  id: number;
  userId: number;
  balance: Decimal;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date | null;
  updatedBy: string | null;
  deletedAt: Date | null;
  deletedBy: string | null;
  isDeleted: boolean;
}
