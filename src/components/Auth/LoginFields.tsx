import { AtSignIcon, EyeIcon, EyeOffIcon, Lock } from "lucide-react";
import Input from "../Input";
import type { TPayloadLogin } from "../../apis/membership";

interface LoginFieldsProps {
  formData: TPayloadLogin;
  toggleVisible: boolean;
  onToggleVisible: () => void;
}

const LoginFields = ({
  formData,
  toggleVisible,
  onToggleVisible,
}: LoginFieldsProps) => {
  return (
    <>
      <Input
        className="w-full"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="Masukkan email anda"
        prefix={<AtSignIcon width={15} />}
        feedbackAlignment="end"
        onChange={(e) => (formData.email = e.target.value)}
      />
      <Input
        className="w-full"
        name="password"
        placeholder="Masukkan password anda"
        type={toggleVisible ? "text" : "password"}
        autoComplete="current-password"
        required
        prefix={<Lock width={15} />}
        feedbackAlignment="end"
        onChange={(e) => (formData.password = e.target.value)}
        suffix={
          toggleVisible ? (
            <EyeIcon
              width={15}
              className="cursor-pointer"
              onClick={onToggleVisible}
            />
          ) : (
            <EyeOffIcon
              width={15}
              className="cursor-pointer"
              onClick={onToggleVisible}
            />
          )
        }
      />
    </>
  );
};

export default LoginFields;
