import { $Enums, Transaction } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class TransactionEntity implements Transaction {
  id: number;
  type: $Enums.TransactionType;
  amount: Decimal;
  fromWalletId: number | null;
  toWalletId: number | null;
  status: $Enums.TransactionStatus;
  reversalId: number | null;

  createdAt: Date;
  createdBy: string;
  updatedAt: Date | null;
  updatedBy: string | null;
  deletedAt: Date | null;
  deletedBy: string | null;
  isDeleted: boolean;
}
