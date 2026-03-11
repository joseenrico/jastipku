import { Skeleton } from "@/components/ui/skeleton";

export function LoadingDots() {
  return (
    <div className="flex items-center gap-1">
      <Skeleton className="h-2 w-2 rounded-full" />
      <Skeleton className="h-2 w-2 rounded-full" />
      <Skeleton className="h-2 w-2 rounded-full" />
    </div>
  );
}
