import { AtSignIcon, EyeIcon, EyeOffIcon, Lock, UserIcon } from "lucide-react";
import Input from "../Input";
import type { TPayloadRegister } from "../../apis/membership";
import { useState } from "react";

interface RegisterFieldsProps {
  formData: TPayloadRegister;
  toggleVisible: boolean;
  onToggleVisible: () => void;
}

const RegisterFields = ({
  formData,
  toggleVisible,
  onToggleVisible,
}: RegisterFieldsProps) => {
  const [toggleVisibleConfirmation, setToggleVisibleConfirmation] =
    useState(false);
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");

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
        name="first_name"
        autoComplete="given-name"
        required
        placeholder="Nama depan"
        prefix={<UserIcon width={15} />}
        feedbackAlignment="end"
        onChange={(e) => (formData.first_name = e.target.value)}
      />
      <Input
        className="w-full"
        name="last_name"
        autoComplete="family-name"
        required
        placeholder="Nama belakang"
        prefix={<UserIcon width={15} />}
        feedbackAlignment="end"
        onChange={(e) => (formData.last_name = e.target.value)}
      />
      <Input
        className="w-full"
        name="password"
        autoComplete="new-password"
        placeholder="Buat password"
        type={toggleVisible ? "text" : "password"}
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
      <Input
        className="w-full"
        name="confirm_password"
        autoComplete="new-password"
        placeholder="Konfirmasi password"
        type={toggleVisibleConfirmation ? "text" : "password"}
        required
        prefix={<Lock width={15} />}
        feedbackAlignment="end"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (e.currentTarget.value !== formData.password) {
              setPasswordConfirmation(e.currentTarget.value);
              e.currentTarget.setCustomValidity("Password tidak sama");
            } else {
              e.currentTarget.setCustomValidity("");
            }
          }
        }}
        onBlur={(e) => {
          if (e.currentTarget.value !== formData.password) {
            setPasswordConfirmation(e.currentTarget.value);
            e.currentTarget.setCustomValidity("Password tidak sama");
          } else {
            e.currentTarget.setCustomValidity("");
          }
        }}
        error={
          formData.password !== passwordConfirmation
            ? "Password tidak sama"
            : ""
        }
        suffix={
          toggleVisibleConfirmation ? (
            <EyeIcon
              width={15}
              className="cursor-pointer"
              onClick={() => setToggleVisibleConfirmation(false)}
            />
          ) : (
            <EyeOffIcon
              width={15}
              className="cursor-pointer"
              onClick={() => setToggleVisibleConfirmation(true)}
            />
          )
        }
      />
    </>
  );
};

export default RegisterFields;
