import { $Enums, Transaction } from '@prisma/client';

export class TransactionEntity implements Transaction {
  id: number;
  type: $Enums.TransactionType;
  amount: string;
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
