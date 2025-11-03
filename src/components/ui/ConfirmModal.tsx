import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure to delete this item?",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div role="dialog" aria-labelledby={title} className="fixed flex items-center justify-center z-50 modal-backdrop">
      <div className="bg-white mx-4 dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-md p-6 animate-fadeIn">
        <h2 className="text-lg dark:text-gray-100 font-bold text-gray-800 mb-3 text-center">{title}</h2>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 font-light">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="btn-secondary"
            aria-label={`Cancel ${title}`}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="btn-alert"
            aria-label={`Cancel ${title}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
