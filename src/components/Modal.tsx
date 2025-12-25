import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[95vw] h-[95vh]",
};

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  className = "",
}: ModalProps) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={clsx(
          "relative bg-white rounded-xl shadow-2xl w-full overflow-hidden flex flex-col",
          "animate-zoom-in",
          sizeClasses[size],
          className
        )}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div className="text-lg font-semibold text-gray-900">
            {title || <div className="h-6" />}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto grow">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
