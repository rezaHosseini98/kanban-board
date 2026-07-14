import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BoardErrorProps {
  error: any;
  onRetry?: () => void;
}

export default function BoardError({ error, onRetry }: BoardErrorProps) {
  const errorMessage =
    typeof error === "string"
      ? error
      : error?.message || "An unexpected error occurred while loading data.";

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[50vh] p-8 bg-red-50/50 border border-red-200 rounded-2xl max-w-md mx-auto text-center shadow-sm my-12"
      dir="ltr"
    >
      <div className="p-3 bg-red-100 rounded-full mb-4">
        <AlertCircle className="w-8 h-8 text-red-600 animate-pulse" />
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-2">
        Error loading boards
      </h2>

      <p className="text-sm text-gray-600 mb-6 leading-relaxed max-w-xs">
        {errorMessage}
      </p>

      <Button
        variant="outline"
        onClick={onRetry || (() => window.location.reload())}
        className="bg-white border-gray-200 hover:bg-gray-50 text-gray-700 font-medium shadow-sm px-6 cursor-pointer"
      >
        Try Again
      </Button>
    </div>
  );
}
