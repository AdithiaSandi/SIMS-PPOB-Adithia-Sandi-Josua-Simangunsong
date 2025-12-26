import LayoutUser from "../../components/LayoutUser";
import InputNominal from "../../components/Payment/InputNominal";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { transactionQueryKeys } from "../../utils/querykeys";
import { topUpBalance } from "../../apis/transaction";
import Toast from "../../components/Toast";
import type { TApiErrorResponse } from "../../apis";
import { useQueryClient } from "@tanstack/react-query";

const TopUp = () => {
  const queryClient = useQueryClient();
  const [nominal, setNominal] = useState<number>();
  const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "error";
  } | null>(null);

  const { mutate: topUp, isPending: pendingTopUp } = useMutation({
    mutationFn: () => topUpBalance({ top_up_amount: nominal as number }),
    onSuccess: (res) => {
      setToast({
        message: res.data.message,
        variant: "success",
      });
      setNominal(undefined);
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.balance });
    },
    onError: (err: TApiErrorResponse) => {
      setToast({
        message: err.response?.data.message || "Terjadi kesalahan",
        variant: "error",
      });
    },
  });

  const handleTopUp = () => {
    topUp();
  };
  return (
    <LayoutUser className="flex flex-col gap-10 pt-15 relative max-w-[1000px] mx-auto w-full">
      <div>
        <p>Silahkan masukan</p>
        <p className="text-2xl font-semibold">Nominal Top Up</p>
      </div>

      <div>
        <InputNominal
          nominal={nominal}
          onChange={(value) => {
            console.log(value);
            setNominal(value);
          }}
          withSuggestion
          onSubmit={pendingTopUp ? undefined : handleTopUp}
        />
      </div>

      {toast && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}
    </LayoutUser>
  );
};

export default TopUp;
