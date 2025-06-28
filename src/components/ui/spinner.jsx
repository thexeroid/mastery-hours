import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const Spinner = ({
  size = "default",
  className,
  text = "Loading...",
  showText = true,
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    default: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className
      )}
    >
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {showText && text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );
};

// Full screen loading spinner
const FullScreenSpinner = ({ text = "Loading your data..." }) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-lg font-medium text-foreground">{text}</p>
      </div>
    </div>
  );
};

// Page loading spinner
const PageSpinner = ({ text = "Loading page..." }) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Spinner size="xl" text={text} />
    </div>
  );
};

// Card loading spinner
const CardSpinner = ({ text = "Loading..." }) => {
  return (
    <div className="p-8 flex items-center justify-center">
      <Spinner size="lg" text={text} />
    </div>
  );
};

export { Spinner, FullScreenSpinner, PageSpinner, CardSpinner };
