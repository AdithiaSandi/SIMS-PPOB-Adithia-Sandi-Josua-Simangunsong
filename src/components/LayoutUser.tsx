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

const LayoutUser = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const [toggleVisible, setToggleVisible] = useState(false);

  const { data: profile, isLoading: loadingProfile } = useQuery({
    enabled: !!auth.token,
    queryKey: ["profile"],
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
    queryKey: ["balance"],
    queryFn: async () => {
      const res = await getBalance();
      if (res.status > 299 || !res.data.data) return;
      return res.data.data;
    },
  });

  return (
    <main>
      <section className="w-full flex gap-5 justify-between items-center py-5 md:px-[10%] px-10 border-b border-gray-200 shadow-sm">
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

      <section className="w-full py-5 md:px-[10%] px-10">
        <div className="w-full flex items-center">
          <div className="flex flex-col grow shrink max-w-[40%]">
            {loadingProfile ? (
              <div className="flex flex-col gap-2">
                <Skeleton variant="circle" width={80} height={80} />
                <Skeleton variant="text" width={200} />
                <Skeleton variant="text" width={300} height={40} />
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
                <p className="text-sm text-gray-500 font-medium pt-4">
                  Selamat datang,
                </p>
                <p className="text-2xl font-bold">
                  {profile?.first_name} {profile?.last_name}
                </p>
              </>
            )}
          </div>
          <div className="flex flex-col gap-2 grow shrink rounded-xl bg-red-600 text-white p-5">
            {loadingBalance ? (
              <div className="flex flex-col gap-2">
                <Skeleton variant="circle" width={80} height={80} />
                <Skeleton variant="text" width={200} />
                <Skeleton variant="text" width={300} height={40} />
              </div>
            ) : (
              <>
                <span className="text-sm w-fit">Saldo anda</span>
                <span className="text-2xl w-fit">
                  Rp {maskBalance(balance?.balance as number, toggleVisible, 6)}
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
        {children}
      </section>
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
