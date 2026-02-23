"use client";

import { useRef } from "react";
import { StorySuggestion, UploadedImage } from "@/lib/types";

interface ComicBookPreviewProps {
  story: StorySuggestion;
  images: UploadedImage[];
  onExport: (element: HTMLDivElement) => void;
}

function getGridLayout(frameCount: number): string {
  switch (frameCount) {
    case 1:
      return "grid-cols-1";
    case 2:
      return "grid-cols-2";
    case 3:
      return "grid-cols-2";
    case 4:
      return "grid-cols-2";
    case 5:
      return "grid-cols-3";
    case 6:
      return "grid-cols-3";
    default:
      return "grid-cols-3";
  }
}

function getFrameSpan(frameCount: number, index: number): string {
  // For 3 images: first one spans full width
  if (frameCount === 3 && index === 0) return "col-span-2";
  // For 5 images: first spans 2 cols
  if (frameCount === 5 && index === 0) return "col-span-2";
  // For 7+: first frame spans 2 cols
  if (frameCount >= 7 && index === 0) return "col-span-2";
  return "";
}

const themeColors: Record<string, { bg: string; accent: string }> = {
  adventure: { bg: "from-amber-900/80 to-orange-900/80", accent: "#f59e0b" },
  discovery: { bg: "from-blue-900/80 to-cyan-900/80", accent: "#06b6d4" },
  transformation: {
    bg: "from-purple-900/80 to-pink-900/80",
    accent: "#a855f7",
  },
  celebration: {
    bg: "from-yellow-900/80 to-red-900/80",
    accent: "#eab308",
  },
  default: { bg: "from-gray-900/80 to-slate-900/80", accent: "#7c3aed" },
};

export default function ComicBookPreview({
  story,
  images,
  onExport,
}: ComicBookPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const colors =
    themeColors[story.theme.toLowerCase()] || themeColors.default;

  return (
    <div className="story-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">{story.title}</h3>
            <span
              className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block"
              style={{
                backgroundColor: `${colors.accent}20`,
                color: colors.accent,
              }}
            >
              {story.theme}
            </span>
          </div>
          <button
            onClick={() => previewRef.current && onExport(previewRef.current)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Export
          </button>
        </div>
        <p className="text-sm text-gray-400 mt-2 italic">
          &ldquo;{story.hookText}&rdquo;
        </p>
      </div>

      {/* Comic Book Grid */}
      <div
        ref={previewRef}
        className={`p-3 bg-gradient-to-br ${colors.bg}`}
        style={{ backgroundColor: "#111" }}
      >
        <div
          className={`grid ${getGridLayout(story.frames.length)} gap-2`}
        >
          {story.frames.map((frame, index) => {
            const image = images[frame.imageIndex];
            if (!image) return null;

            return (
              <div
                key={index}
                className={`comic-frame aspect-[3/4] ${getFrameSpan(story.frames.length, index)}`}
              >
                <img
                  src={image.preview}
                  alt={frame.caption}
                  className="w-full h-full object-cover"
                />
                <div className="comic-number">{index + 1}</div>
                <div className="comic-caption">
                  <p className="comic-caption-text">{frame.caption}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Closing text */}
        <div className="text-center mt-3 pb-1">
          <p className="text-white/80 text-sm font-medium italic">
            {story.closingText}
          </p>
        </div>
      </div>

      {/* Story breakdown */}
      <div className="p-4 border-t border-gray-700/50">
        <h4 className="text-sm font-semibold text-gray-300 mb-2">
          Story Breakdown
        </h4>
        <div className="space-y-2">
          {story.frames.map((frame, index) => (
            <div
              key={index}
              className="flex gap-3 text-sm"
            >
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  backgroundColor: `${colors.accent}30`,
                  color: colors.accent,
                }}
              >
                {index + 1}
              </span>
              <p className="text-gray-400">{frame.narrativeText}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
