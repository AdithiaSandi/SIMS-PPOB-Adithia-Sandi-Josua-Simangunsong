import { useRef, useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import Button from "../../components/Button";
import {
  login,
  register,
  type TPayloadLogin,
  type TPayloadRegister,
} from "../../apis/membership";
import { useAppDispatch } from "../../store/hooks";
import { loginSuccess } from "../../store/slices/authSlice";
import type { TApiErrorResponse } from "../../apis";

import BrandHeader from "../../components/Auth/BrandHeader";
import LoginFields from "../../components/Auth/LoginFields";
import RegisterFields from "../../components/Auth/RegisterFields";
import Toast from "../../components/Toast";

const Auth = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [toggleVisible, setToggleVisible] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "error";
  } | null>(null);

  const layout = searchParams.get("l") || "login";
  const isLogin = layout === "login";

  const formDataRef = useRef({
    login: { email: "", password: "" } as TPayloadLogin,
    register: {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
    } as TPayloadRegister,
  });

  const { mutate: loginMutation, isPending: loginLoading } = useMutation({
    mutationFn: (payload: TPayloadLogin) => login(payload),
    onSuccess: (res) => {
      if (res.status > 299 || !res.data.data) throw new Error(res.data.message);
      dispatch(loginSuccess({ user: null, token: res.data.data.token }));
      navigate("/", { replace: true });
    },
    onError: (error: TApiErrorResponse) => {
      setToast({
        message: error.response?.data.message || "Email atau password salah",
        variant: "error",
      });
    },
  });

  const { mutate: registerMutation, isPending: registerLoading } = useMutation({
    mutationFn: (payload: TPayloadRegister) => register(payload),
    onSuccess: (res) => {
      if (res.status > 299) throw new Error(res.data.message);
      setToast({
        message: "Registrasi berhasil, silahkan login",
        variant: "success",
      });
      navigate("/auth?l=login", { replace: true });
    },
    onError: (error: TApiErrorResponse) => {
      setToast({
        message: error.response?.data.message || "Registrasi gagal",
        variant: "error",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) return;

    if (isLogin) {
      loginMutation(formDataRef.current.login);
    } else {
      registerMutation(formDataRef.current.register);
    }
  };

  const handleToggleLayout = () => {
    setToast(null);
    setSearchParams({ l: isLogin ? "register" : "login" });
  };

  const illustrationSrc = "/assets/Illustrasi Login.png";
  const bgStyle = useMemo(
    () => ({
      backgroundImage: `linear-gradient(rgba(256, 256, 256, 0.9), rgba(256, 256, 256, 0.9)), url('${illustrationSrc}')`,
    }),
    []
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <form
        noValidate
        onSubmit={handleSubmit}
        className="w-full flex flex-col justify-between py-10 lg:bg-none! bg-cover bg-center relative overflow-y-auto"
        style={bgStyle}
      >
        <div className="max-w-[80%] lg:max-w-[60%] flex flex-col items-center justify-center gap-10 mx-auto my-auto w-full">
          <BrandHeader subtitle="Masuk atau buat akun untuk memulai" />

          <div className="w-full flex flex-col gap-4">
            {isLogin ? (
              <LoginFields
                formData={formDataRef.current.login}
                toggleVisible={toggleVisible}
                onToggleVisible={() => setToggleVisible(!toggleVisible)}
              />
            ) : (
              <RegisterFields
                formData={formDataRef.current.register}
                toggleVisible={toggleVisible}
                onToggleVisible={() => setToggleVisible(!toggleVisible)}
              />
            )}

            <Button
              type="submit"
              variant="danger"
              className="mt-4"
              disabled={loginLoading || registerLoading}
            >
              {isLogin ? "Masuk" : "Registrasi"}
            </Button>

            <p className="text-center text-gray-500 text-sm">
              {isLogin
                ? "Belum punya akun? Registrasi "
                : "Sudah punya akun? Login "}
              <span
                className="text-red-600 cursor-pointer font-bold hover:underline"
                onClick={handleToggleLayout}
              >
                di sini
              </span>
            </p>
          </div>
        </div>

        {toast && (
          <Toast
            message={toast.message}
            variant={toast.variant}
            onClose={() => setToast(null)}
          />
        )}
      </form>

      <div className="w-full h-full overflow-hidden max-lg:hidden flex items-center justify-center bg-gray-50">
        <img
          src={illustrationSrc}
          alt="Illustration"
          className="w-full h-full object-cover select-none"
        />
      </div>
    </div>
  );
};

export default Auth;
