'use client';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-white/5 border border-white/10",
        className
      )}
      {...props}
    />
  );
}

export function TourCardSkeleton() {
  return (
    <div className="card tour-card-v2 overflow-hidden flex flex-col h-full bg-dark-section border border-border">
      <Skeleton className="h-[250px] w-full" />
      <div className="p-6 space-y-4 flex-1">
        <div className="flex justify-between items-start gap-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-1/4 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="pt-4 mt-auto border-t border-border/50">
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
    </div>
  );
}

export function GallerySkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <Skeleton key={i} className="aspect-square w-full rounded-xl" />
      ))}
    </div>
  );
}

export function StaySkeleton() {
  return (
    <div className="card h-full bg-dark-section border border-border overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-1/2 mx-auto" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3 mx-auto" />
      </div>
    </div>
  );
}
