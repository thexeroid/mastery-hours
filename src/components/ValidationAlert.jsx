import React from "react";
import { AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const ValidationAlert = ({ isVisible, message, onClose, type = "error" }) => {
  if (!isVisible) return null;

  const bgColor =
    type === "error"
      ? "bg-destructive/10 border-destructive/20 text-destructive"
      : "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-100";

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom-2 duration-300">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${bgColor}`}
      >
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span className="text-sm font-medium">{message}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0 hover:bg-black/10 dark:hover:bg-white/10"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};

export default ValidationAlert;
