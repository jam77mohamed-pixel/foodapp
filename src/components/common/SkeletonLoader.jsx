import React from 'react';

export const RestaurantSkeletonCard = () => {
  return (
    <div className="rounded-2xl bg-[#18181b]/80 border border-neutral-800/80 p-4 space-y-4 overflow-hidden">
      {/* Image Skeleton */}
      <div className="w-full h-44 rounded-xl skeleton-shimmer" />

      {/* Title & Cuisine */}
      <div className="space-y-2">
        <div className="w-3/4 h-5 rounded-md skeleton-shimmer" />
        <div className="w-1/2 h-4 rounded-md skeleton-shimmer" />
      </div>

      {/* Details Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-neutral-800/60">
        <div className="w-16 h-4 rounded-md skeleton-shimmer" />
        <div className="w-20 h-4 rounded-md skeleton-shimmer" />
        <div className="w-14 h-4 rounded-md skeleton-shimmer" />
      </div>
    </div>
  );
};

export const MenuSkeletonCard = () => {
  return (
    <div className="rounded-3xl bg-[#18181b]/80 border border-neutral-800/80 overflow-hidden space-y-4 p-4">
      <div className="w-full h-44 rounded-2xl skeleton-shimmer" />
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="w-24 h-4 rounded skeleton-shimmer" />
          <div className="w-16 h-4 rounded skeleton-shimmer" />
        </div>
        <div className="w-3/4 h-5 rounded skeleton-shimmer" />
        <div className="w-full h-8 rounded skeleton-shimmer" />
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
        <div className="w-1/2 h-8 rounded-xl skeleton-shimmer" />
        <div className="w-1/4 h-8 rounded-xl skeleton-shimmer" />
      </div>
    </div>
  );
};

export const DashboardStatsSkeleton = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="p-4 rounded-2xl bg-[#18181b]/80 border border-neutral-800 space-y-3">
          <div className="w-1/2 h-3 rounded skeleton-shimmer" />
          <div className="w-3/4 h-7 rounded skeleton-shimmer" />
          <div className="w-full h-4 rounded skeleton-shimmer" />
        </div>
      ))}
    </div>
  );
};
