import { keepPreviousData, useQuery } from "@tanstack/react-query";
import LayoutUser from "../../components/LayoutUser";
import { getAllTransactions } from "../../apis/transaction";
import { transactionQueryKeys } from "../../utils/querykeys";
import { useState } from "react";
import { convertDate, formatCurrency } from "../../utils";
import { TRANSACTION_TYPE } from "../../utils/constant";
import clsx from "clsx";

const Transactions = () => {
  const [isLimit, setIsLimit] = useState(false);
  const [limit, setLimit] = useState(5);

  const { data: transactions } = useQuery({
    queryKey: [transactionQueryKeys.history, limit],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await getAllTransactions({ offset: 0, limit });
      if (res.status > 299 || !res.data.data) return;
      if (res.data.data.records && res.data.data.records.length < limit) {
        setIsLimit(true);
      } else {
        setIsLimit(false);
      }
      return res.data.data;
    },
  });
  return (
    <LayoutUser className="flex flex-col gap-5 pt-5 lg:pt-15 pb-5 lg:pb-10 relative max-w-[1000px] mx-auto w-full">
      <p className="font-semibold">Semua Transaksi</p>

      {transactions?.records?.map((transaction) => {
        const isTopUp = transaction.transaction_type === TRANSACTION_TYPE.topup;
        return (
          <div
            key={transaction.invoice_number}
            className="border border-gray-100 rounded-lg shadow-sm py-2.5 px-5 flex gap-1 justify-between"
          >
            <div>
              <div
                className={clsx(
                  "flex gap-2 text-2xl font-semibold",
                  isTopUp ? "text-green-500" : "text-red-500"
                )}
              >
                <p>{isTopUp ? "+" : "-"}</p>
                <p>Rp.{formatCurrency(transaction.total_amount)}</p>
              </div>
              <p className="text-caption text-gray-300">
                {convertDate(transaction.created_on)} WIB
              </p>
            </div>
            <p className="text-xs text-gray-600 font-semibold">
              {transaction.description}
            </p>
          </div>
        );
      })}
      {isLimit ? (
        <p className="text-center text-gray-300">Tidak ada transaksi lagi</p>
      ) : (
        <p
          className="cursor-pointer text-red-600 text-center font-semibold"
          onClick={() => setLimit(limit + 5)}
        >
          Show more
        </p>
      )}
    </LayoutUser>
  );
};

export default Transactions;
