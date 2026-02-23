"use client";

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-700 rounded-full" />
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" />
      </div>
      <div className="text-center">
        <p className="text-lg font-medium loading-pulse">
          Crafting your stories...
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Analyzing images and building narratives
        </p>
      </div>
    </div>
  );
}
