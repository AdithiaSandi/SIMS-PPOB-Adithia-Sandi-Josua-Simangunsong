import {
  getMethod,
  postMethod,
  type TApiResponse,
  type TApiResponsePagination,
  type TPaginationParam,
} from ".";
import type { ServiceItem } from "./information";

export const getBalance = async () => {
  return getMethod<TApiResponse<{ balance: number }>>("/balance");
};

export const topUpBalance = async (payload: { top_up_amount: number }) => {
  return postMethod<typeof payload, TApiResponse<{ balance: number }>>(
    "/top-up",
    payload
  );
};

export type TransactionItem = Pick<
  ServiceItem,
  "service_code" | "service_name"
> &
  Omit<TransactionHistory, "description">;

const baseUrlTransaction = "/transactions";
export const addTransaction = async (payload: { service_code: string }) => {
  return postMethod<typeof payload, TApiResponse<TransactionItem>>(
    baseUrlTransaction,
    payload
  );
};

export type TransactionHistory = {
  invoice_number: string;
  transaction_type: string;
  description: string;
  total_amount: number;
  created_on: string;
};

export const getTransactions = async (params: TPaginationParam) => {
  return getMethod<TApiResponsePagination<TransactionHistory[]>>(
    `${baseUrlTransaction}/history`,
    { params }
  );
};
