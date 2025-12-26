import { useNavigate, useLocation } from "react-router-dom";
import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../apis/membership";
import Skeleton from "./Skeleton";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loginSuccess } from "../store/slices/authSlice";
import { selectAuth } from "../store/selectors";
import { getBalance } from "../apis/transaction";
import { EyeIcon } from "lucide-react";
import { useState } from "react";
import { maskBalance } from "../utils";
import { membershipQueryKeys, transactionQueryKeys } from "../utils/querykeys";
import ScrollToTop from "./ScrollToTop";

const LayoutUser = ({
  children,
  className,
  withHeader = true,
}: {
  children: React.ReactNode;
  className?: string;
  withHeader?: boolean;
}) => {
  const navigate = useNavigate();
  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const [toggleVisible, setToggleVisible] = useState(false);

  const { data: profile, isLoading: loadingProfile } = useQuery({
    enabled: !!auth.token,
    queryKey: membershipQueryKeys.profile,
    queryFn: async () => {
      const res = await getProfile();
      if (res.status > 299 || !res.data.data) return;
      dispatch(
        loginSuccess({ user: res.data.data, token: auth.token as string })
      );
      return res.data.data;
    },
  });

  const { data: balance, isLoading: loadingBalance } = useQuery({
    enabled: !!auth.token,
    queryKey: transactionQueryKeys.balance,
    queryFn: async () => {
      const res = await getBalance();
      if (res.status > 299 || !res.data.data) return;
      return res.data.data;
    },
  });

  return (
    <main className="text-[#282627] min-h-screen flex flex-col">
      <section className="w-full flex gap-5 justify-between items-center lg:py-5 max-lg:py-2 md:px-[10%] px-10 border-b border-gray-200 shadow-sm shrink-0">
        <div
          className="w-full flex gap-2 items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src="/assets/Logo.png" alt="Logo" className="max-h-6" />
          <p className="text-base font-semibold">SIMS POPB</p>
        </div>
        <div className="text-lg text-gray-700 font-semibold flex w-full items-center justify-end lg:gap-10 gap-2 md:gap-5">
          <NavItem label="Top Up" path="/topup" />
          <NavItem label="Transaction" path="/transactions" />
          <NavItem label="Akun" path="/profile" />
        </div>
      </section>

      <section className="w-full lg:py-5 max-lg:py-2 md:px-[10%] px-10 flex-1 flex flex-col">
        {withHeader && (
          <div className="w-full flex items-center shrink-0">
            <div className="flex flex-col grow shrink max-w-[40%]">
              {loadingProfile ? (
                <div className="flex flex-col gap-2 w-full">
                  <Skeleton variant="circle" width={80} height={80} />
                  <Skeleton variant="text" className="w-[60%]" />
                  <Skeleton variant="text" className="w-[80%]" height={40} />
                </div>
              ) : (
                <>
                  <img
                    src={
                      profile?.profile_image.includes("null")
                        ? "/assets/Profile Photo.png"
                        : profile?.profile_image
                    }
                    alt="Profile"
                    className="w-20 h-20 rounded-full"
                  />
                  <p className="text-sm pt-4">Selamat datang,</p>
                  <p className="text-2xl font-semibold">
                    {profile?.first_name} {profile?.last_name}
                  </p>
                </>
              )}
            </div>
            <div className="flex flex-col gap-2 grow shrink rounded-xl bg-red-600 text-white p-5">
              {loadingBalance ? (
                <div className="flex flex-col gap-2 h-full justify-center w-full">
                  <Skeleton variant="text" className="w-[40%]" height={20} />
                  <Skeleton variant="text" className="w-[70%]" height={40} />
                  <Skeleton variant="text" className="w-[30%]" height={20} />
                </div>
              ) : (
                <>
                  <span className="text-sm w-fit">Saldo anda</span>
                  <span className="text-2xl w-fit font-semibold">
                    Rp{" "}
                    {maskBalance(balance?.balance as number, toggleVisible, 7)}
                  </span>
                  <span
                    className="text-xs flex gap-2 items-center cursor-pointer w-fit"
                    onClick={() => setToggleVisible((prev) => !prev)}
                  >
                    <span className="min-w-16">
                      {toggleVisible ? "Tutup Saldo" : "Lihat Saldo"}
                    </span>
                    <EyeIcon width={15} />
                  </span>
                </>
              )}
            </div>
          </div>
        )}
        <div className={clsx("flex-1 flex flex-col", className)}>
          {children}
        </div>
      </section>
      <ScrollToTop />
    </main>
  );
};

export default LayoutUser;

const NavItem = ({ label, path }: { label: string; path: string }) => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <span
      className={clsx(
        "transition-all duration-200 hover:[text-shadow:0_0_8px_rgba(239,68,68,0.5)] cursor-pointer text-nowrap",
        location.pathname === path &&
          "text-red-500 [text-shadow:0_0_8px_rgba(239,68,68,0.4)]"
      )}
      onClick={() => navigate(path)}
    >
      {label}
    </span>
  );
};
