import { useState, useEffect } from "react";
import { X, Star, CheckCircle, AlertCircle } from "lucide-react";
import type { ToastProps } from "../domain/Toast";

export default function Toast({
  message,
  type = "success",
  duration = 3000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsAnimating(true), 10);

    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  const getIconAndStyles = () => {
    switch (type) {
      case "success":
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          textColor: "text-green-800",
          iconColor: "text-green-600",
        };
      case "error":
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-800",
          iconColor: "text-red-600",
        };
      default:
        return {
          icon: <Star className="w-5 h-5" />,
          bgColor: "bg-slate-50",
          borderColor: "border-slate-200",
          textColor: "text-slate-800",
          iconColor: "text-blue-600",
        };
    }
  };

  const { icon, bgColor, borderColor, textColor, iconColor } =
    getIconAndStyles();

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`${bgColor} ${borderColor} ${textColor}
          border rounded-lg shadow-lg max-w-md min-w-80
          transform transition-all duration-300 ease-in-out
          ${
            isAnimating
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-2 opacity-0 scale-95"
          }`}
        style={{
          boxShadow:
            "0 10px 25px -3px rgba(0, 166, 232, 0.1), 0 4px 6px -2px rgba(0, 166, 232, 0.05)",
        }}
      >
        <div className="flex items-start p-4 gap-3">
          <div className={`flex-shrink-0 ${iconColor}`}>{icon}</div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-5">{message}</p>
          </div>

          <button
            onClick={handleClose}
            className={`flex-shrink-0 ml-2 p-1 rounded-full hover:bg-black hover:bg-opacity-5 transition-colors duration-200 ${textColor}`}
            aria-label="Cerrar notificación"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-4 pb-2">
          <div className="w-full bg-black bg-opacity-10 rounded-full h-1">
            <div
              className="h-1 rounded-full transition-all duration-100 ease-linear"
              style={{
                backgroundColor: "#00A6E8",
                animation: `shrink ${duration}ms linear forwards`,
              }}
            />
          </div>
        </div>
      </div>
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
