import type { TransactionType } from "../apis/transaction";

export const localStorageNamespace = "token";

export const nominalTopUp = [10000, 20000, 50000, 100000, 250000, 500000];

export const TRANSACTION_TYPE: Record<string, TransactionType> = {
  topup: "TOPUP",
  payment: "PAYMENT",
};
