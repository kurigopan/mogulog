import React from "react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: React.ReactNode;
  cancelText?: string;
  confirmText: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmationDialog({
  isOpen,
  title,
  message,
  cancelText = "キャンセル",
  confirmText,
  onClose,
  onConfirm,
}: ConfirmationDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-stone-700 mb-2">{title}</h3>
          <div className="text-sm text-stone-500">{message}</div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex flex-1 justify-center py-3 px-4 rounded-2xl font-medium bg-stone-100 text-stone-600 hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex flex-1 justify-center py-3 px-4 rounded-2xl font-medium bg-violet-400 text-white hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
