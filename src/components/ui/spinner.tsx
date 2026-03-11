import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  "data-icon"?: "inline-start" | "inline-end";
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, "data-icon": dataIcon, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "animate-spin",
          dataIcon === "inline-start" && "mr-2 h-4 w-4",
          dataIcon === "inline-end" && "ml-2 h-4 w-4",
          !dataIcon && "h-4 w-4",
          className
        )}
        {...props}
      >
        <Loader2 className="h-full w-full" />
      </div>
    );
  }
);
Spinner.displayName = "Spinner";

export { Spinner };
