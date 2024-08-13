import { Wallet } from '@prisma/client';

export class WalletEntity implements Wallet {
  id: number;
  userId: number;
  balance: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date | null;
  updatedBy: string | null;
  deletedAt: Date | null;
  deletedBy: string | null;
  isDeleted: boolean;
}
