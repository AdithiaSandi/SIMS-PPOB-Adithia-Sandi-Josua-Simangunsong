import { XIcon, CheckCircle2, AlertCircle } from "lucide-react";
import clsx from "clsx";
import { useEffect } from "react";

export type ToastVariant = "success" | "error" | "info";

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  onClose: () => void;
  duration?: number;
  className?: string;
}

const variantStyles: Record<ToastVariant, string> = {
  success: "bg-green-50 text-green-600 border-green-100",
  error: "bg-red-50 text-red-600 border-red-100",
  info: "bg-blue-50 text-blue-600 border-blue-100",
};

const variantIcons: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle2 width={16} />,
  error: <AlertCircle width={16} />,
  info: <AlertCircle width={16} />,
};

const Toast = ({
  message,
  variant = "error",
  onClose,
  duration = 5000,
  className = "",
}: ToastProps) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div
      className={clsx(
        "absolute bottom-10 left-1/2 -translate-x-1/2 z-100",
        "w-[90%] md:w-[80%] lg:max-w-[60%]",
        "flex items-center gap-3 justify-between p-2 rounded-lg border shadow-xl backdrop-blur-md",
        "text-sm font-semibold cursor-pointer animate-in fade-in slide-in-from-bottom-5",
        "transition-all duration-300 hover:scale-[1.01]",
        variantStyles[variant],
        className
      )}
      onClick={onClose}
    >
      <div className="flex items-center gap-3 flex-1">
        <div className="shrink-0">{variantIcons[variant]}</div>
        <p className="flex-1 leading-tight">{message}</p>
      </div>
      <XIcon
        width={18}
        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
      />
    </div>
  );
};

export default Toast;
