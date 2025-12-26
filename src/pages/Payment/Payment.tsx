import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getServices } from "../../apis/information";
import LayoutUser from "../../components/LayoutUser";
import InputNominal from "../../components/Payment/InputNominal";
import { useState } from "react";
import Toast from "../../components/Toast";
import { addTransaction } from "../../apis/transaction";
import type { TApiErrorResponse } from "../../apis";
import Skeleton from "../../components/Skeleton";
import { transactionQueryKeys } from "../../utils/querykeys";

const Payment = () => {
  const [searchParam] = useSearchParams();
  const serviceCode = searchParam.get("s");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "error";
  } | null>(null);

  const { data: service, isLoading: loadingServices } = useQuery({
    enabled: !!serviceCode,
    queryKey: ["payment", "services"],
    queryFn: async () => {
      const res = await getServices();
      if (res.status > 299 || !res.data.data) return;
      const serviceData = res.data.data.find(
        (service) => service.service_code === serviceCode
      );
      if (!serviceData) navigate("/");
      return serviceData;
    },
  });

  const { mutate: payService, isPending: pendingPayment } = useMutation({
    mutationFn: () => addTransaction({ service_code: serviceCode as string }),
    onSuccess: (res) => {
      setToast({
        message: res.data.message,
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.balance });
    },
    onError: (err: TApiErrorResponse) => {
      setToast({
        message: err.response?.data.message || "Terjadi kesalahan",
        variant: "error",
      });
    },
  });

  const handlePayment = () => {
    payService();
  };

  return (
    <LayoutUser className="flex flex-col gap-10 pt-15 relative max-w-[1000px] mx-auto w-full">
      <div className="flex flex-col gap-2">
        <p>Pembayaran</p>
        <div className="flex gap-2 items-center">
          {loadingServices ? (
            <>
              <Skeleton width={35} height={35} variant="rectangle" />
              <Skeleton width={200} height={30} variant="text" />
            </>
          ) : (
            <>
              <img
                src={service?.service_icon}
                alt={service?.service_name}
                width={35}
                className="aspect-square rounded-lg"
              />
              <p className="text-xl font-semibold">{service?.service_name}</p>
            </>
          )}
        </div>
      </div>

      {loadingServices ? (
        <div className="flex flex-col gap-2 w-full">
          <Skeleton height={45} className="w-full" />
          <Skeleton height={45} className="w-full" />
        </div>
      ) : (
        <div>
          <InputNominal
            nominal={service?.service_tariff}
            onSubmit={!service || pendingPayment ? undefined : handlePayment}
            readOnly
          />
        </div>
      )}

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

export default Payment;
