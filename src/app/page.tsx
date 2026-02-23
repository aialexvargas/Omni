"use client";

import { useState, useCallback } from "react";
import ImageUploader from "@/components/ImageUploader";
import StoryTypeSelector from "@/components/StoryTypeSelector";
import ComicBookPreview from "@/components/ComicBookPreview";
import LoadingSpinner from "@/components/LoadingSpinner";
import { UploadedImage, StorySuggestion, StoryType } from "@/lib/types";

export default function Home() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [storyType, setStoryType] = useState<StoryType>("trip");
  const [context, setContext] = useState("");
  const [stories, setStories] = useState<StorySuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"upload" | "results">("upload");

  const handleGenerate = useCallback(async () => {
    if (images.length < 2) {
      setError("Please upload at least 2 images to create a story");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: images.map((img) => ({
            base64: img.base64,
            mimeType: img.mimeType,
          })),
          context:
            context ||
            `Create an engaging ${storyType} story for social media`,
          storyType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate stories");
      }

      setStories(data.stories);
      setStep("results");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [images, context, storyType]);

  const handleExport = useCallback(async (element: HTMLDivElement) => {
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(element, {
        backgroundColor: "#111",
        scale: 2,
        useCORS: true,
      });

      const link = document.createElement("a");
      link.download = `omni-story-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      alert("Export failed. Please try again.");
    }
  }, []);

  const handleReset = () => {
    setStep("upload");
    setStories([]);
    setError(null);
  };

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold">Omni</h1>
            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
              AI Story Generator
            </span>
          </div>
          {step === "results" && (
            <button
              onClick={handleReset}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              &#8592; New Story
            </button>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {step === "upload" && (
          <div className="space-y-8">
            {/* Hero */}
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-3">
                Turn your photos into{" "}
                <span className="text-purple-400">comic-book stories</span>
              </h2>
              <p className="text-gray-400">
                Upload your photos, choose a story type, and let AI craft
                compelling narratives where each image tells a chapter of your
                story.
              </p>
            </div>

            {/* Step 1: Upload */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </span>
                <h3 className="text-lg font-semibold">Upload your photos</h3>
              </div>
              <ImageUploader images={images} onImagesChange={setImages} />
            </section>

            {/* Step 2: Story Type */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </span>
                <h3 className="text-lg font-semibold">
                  Choose your story type
                </h3>
              </div>
              <StoryTypeSelector
                selected={storyType}
                onSelect={setStoryType}
              />
            </section>

            {/* Step 3: Context */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </span>
                <h3 className="text-lg font-semibold">
                  Add context{" "}
                  <span className="text-sm text-gray-500 font-normal">
                    (optional)
                  </span>
                </h3>
              </div>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Tell us more about what these photos are about... e.g., 'Weekend trip to Big Sur with friends, highlight the scenic views and camping vibes'"
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-gray-200 placeholder-gray-500 resize-none focus:outline-none focus:border-purple-500 transition-colors"
                rows={3}
              />
            </section>

            {/* Error */}
            {error && (
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Generate Button */}
            <div className="flex justify-center">
              <button
                onClick={handleGenerate}
                disabled={loading || images.length < 2}
                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-xl transition-colors text-lg"
              >
                {loading ? "Generating..." : "Generate Stories"}
              </button>
            </div>

            {loading && <LoadingSpinner />}
          </div>
        )}

        {step === "results" && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">
                Your Story Suggestions
              </h2>
              <p className="text-gray-400">
                We crafted {stories.length} story variations. Each one arranges
                your photos as comic-book frames with narrative captions.
              </p>
            </div>

            <div className="space-y-8">
              {stories.map((story, index) => (
                <ComicBookPreview
                  key={index}
                  story={story}
                  images={images}
                  onExport={handleExport}
                />
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={handleReset}
                className="px-6 py-2 border border-gray-600 hover:border-gray-500 text-gray-300 rounded-lg transition-colors"
              >
                Create Another Story
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
