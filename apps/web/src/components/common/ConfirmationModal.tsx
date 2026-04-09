import Button from "@/components/common/Button";
import { useState } from "react";

interface ConfirmationModalProps {
  open: boolean;
  title?: string;
  message?: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export default function ConfirmationModal({
  open,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-gray-200 p-6 animate-fade-in">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>

        <p className="mt-3 text-gray-600">{message}</p>

        <div className="mt-6 flex justify-end gap-3">
          <Button onClick={onCancel} variant="outline" disabled={loading}>
            No
          </Button>
          <Button
            variant="danger"
            loading={loading}
            onClick={async () => {
              setLoading(true);
              try {
                await onConfirm();
              } catch (error) {
                console.error("Error in confirmation action:", error);
              } finally {
                setLoading(false);
              }
            }}
          >
            Yes
          </Button>
        </div>
      </div>
    </div>
  );
}
