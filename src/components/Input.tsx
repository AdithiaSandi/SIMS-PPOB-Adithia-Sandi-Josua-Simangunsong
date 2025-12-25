import clsx from "clsx";
import type { InputHTMLAttributes, ReactNode } from "react";
import { useState } from "react";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix" | "suffix"> {
  prefix?: ReactNode;
  suffix?: ReactNode;
  error?: string;
  message?: string;
  feedbackAlignment?: "start" | "end";
}

const Input = ({
  prefix,
  suffix,
  error,
  message,
  className = "",
  placeholder = "Enter text",
  value: externalValue,
  onChange,
  feedbackAlignment = "start",
  ...props
}: InputProps) => {
  const [internalValue, setInternalValue] = useState("");
  const value = externalValue ?? internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
    onChange?.(e);
  };

  const iconBaseStyling = clsx(
    "shrink-0 mr-2 transition-all text-gray-400",
    "group-has-[input:not(:placeholder-shown)]:text-gray-900",
    "group-has-[:user-invalid]:text-red-600"
  );

  const baseStyles = clsx(
    "flex items-center border rounded-md px-3 py-2 duration-200 transition-all w-full",
    "border-gray-400",
    "has-[input:not(:placeholder-shown)]:border-gray-900",
    "focus-within:border-blue-500! focus-within:has-[:user-invalid]:border-red-500! focus-within:ring-2 focus-within:ring-blue-500",
    "has-[:user-invalid]:border-red-600 has-[:user-invalid]:focus-within:ring-red-500"
  );

  const isErrorManual = !!error;

  return (
    <div className="w-full group">
      <div
        className={clsx(
          baseStyles,
          isErrorManual && "border-red-600 focus-within:ring-red-500",
          className
        )}
      >
        {prefix && <span className={iconBaseStyling}>{prefix}</span>}
        <input
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="flex-1 outline-none bg-transparent text-gray-900 placeholder-gray-400 peer"
          {...props}
        />
        {suffix && <span className={iconBaseStyling}>{suffix}</span>}
      </div>
      {(error || props.required) && (
        <p
          className="mt-1 text-sm text-red-600 hidden group-has-user-invalid:block"
          style={{ textAlign: feedbackAlignment }}
        >
          {error || "Harus diisi"}
        </p>
      )}
      {/* {error ? (
        <p
          className="mt-1 text-sm text-red-600"
          style={{ textAlign: feedbackAlignment }}
        >
          {error}
        </p>
      ) : (
        <>
          <p
            className="mt-1 text-sm text-red-600 hidden group-has-[:user-invalid:placeholder-shown]:block"
            style={{ textAlign: feedbackAlignment }}
          >
            Harus diisi
          </p>
          <p
            className="mt-1 text-sm text-red-600 hidden group-has-[:user-invalid:not(:placeholder-shown)]:block"
            style={{ textAlign: feedbackAlignment }}
          >
            {props.type === "email"
              ? "Format email tidak sesuai"
              : "Input tidak valid"}
          </p>
        </>
      )} */}
      {message && !error && (
        <p
          className="mt-1 text-sm text-green-500 group-has-user-invalid:hidden"
          style={{ textAlign: feedbackAlignment }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default Input;
