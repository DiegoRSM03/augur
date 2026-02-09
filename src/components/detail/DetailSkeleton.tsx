import { Skeleton } from '../ui';

export function DetailSkeleton() {
  return (
    <div className="p-4 sm:p-5 flex-1">
      <div className="mb-6">
        <Skeleton className="w-12 h-3 mb-2" />
        <Skeleton className="w-full h-5" />
      </div>

      <div className="mb-6">
        <Skeleton className="w-20 h-3 mb-2" />
        <div className="flex gap-2 mt-1">
          <Skeleton className="w-16 h-5" />
          <Skeleton className="w-12 h-4" />
        </div>
      </div>

      <div className="mb-6">
        <Skeleton className="w-24 h-3 mb-2" />
        <div className="flex items-center gap-3 mt-1">
          <Skeleton className="w-[120px] h-1.5" />
          <Skeleton className="w-10 h-5" />
        </div>
      </div>

      <div className="mb-6">
        <Skeleton className="w-10 h-3 mb-2" />
        <div className="flex gap-1.5 flex-wrap mt-1">
          <Skeleton className="w-14 h-5" />
          <Skeleton className="w-16 h-5" />
          <Skeleton className="w-12 h-5" />
        </div>
      </div>

      <div className="mb-6">
        <Skeleton className="w-16 h-3 mb-2" />
        <div className="space-y-2">
          <div className="flex justify-between py-2 border-b border-border-subtle">
            <Skeleton className="w-16 h-4" />
            <Skeleton className="w-32 h-4" />
          </div>
          <div className="flex justify-between py-2">
            <Skeleton className="w-16 h-4" />
            <Skeleton className="w-20 h-4" />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <Skeleton className="w-14 h-3 mb-2" />
        <div className="flex justify-between py-2 border-b border-border-subtle">
          <Skeleton className="w-14 h-4" />
          <Skeleton className="w-20 h-4" />
        </div>
      </div>
    </div>
  );
}
