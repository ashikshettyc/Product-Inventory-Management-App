import React from 'react';

export default function Modal({
  open,
  children,
  onClose,
}: {
  open: boolean;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/30 bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[350px] w-full max-w-lg relative">
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute top-2 right-3 text-2xl text-gray-600 font-bold hover:text-red-600"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
