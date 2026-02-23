"use client";

import { useCallback, useRef } from "react";
import { UploadedImage } from "@/lib/types";

interface ImageUploaderProps {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  maxImages?: number;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data:mime;base64, prefix
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ImageUploader({
  images,
  onImagesChange,
  maxImages = 10,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (files: FileList) => {
      const newImages: UploadedImage[] = [];
      const remaining = maxImages - images.length;
      const filesToProcess = Array.from(files).slice(0, remaining);

      for (const file of filesToProcess) {
        if (!file.type.startsWith("image/")) continue;

        const base64 = await fileToBase64(file);
        const preview = URL.createObjectURL(file);

        newImages.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          file,
          preview,
          base64,
          mimeType: file.type,
        });
      }

      onImagesChange([...images, ...newImages]);
    },
    [images, onImagesChange, maxImages]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const removeImage = (id: string) => {
    const updated = images.filter((img) => img.id !== id);
    onImagesChange(updated);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    const updated = [...images];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    onImagesChange(updated);
  };

  return (
    <div className="space-y-4">
      <div
        className="dropzone p-8 text-center cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <div className="flex flex-col items-center gap-3">
          <svg
            className="w-12 h-12 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <div>
            <p className="text-lg font-medium">Drop your photos here</p>
            <p className="text-sm text-gray-400 mt-1">
              or click to browse ({images.length}/{maxImages} photos)
            </p>
          </div>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {images.map((img, index) => (
            <div key={img.id} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-800">
                <img
                  src={img.preview}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-1.5 left-1.5 bg-black/70 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {index + 1}
              </div>
              <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {index > 0 && (
                  <button
                    onClick={() => moveImage(index, index - 1)}
                    className="bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-black/90"
                    title="Move left"
                  >
                    &#8592;
                  </button>
                )}
                {index < images.length - 1 && (
                  <button
                    onClick={() => moveImage(index, index + 1)}
                    className="bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-black/90"
                    title="Move right"
                  >
                    &#8594;
                  </button>
                )}
                <button
                  onClick={() => removeImage(img.id)}
                  className="bg-red-600/80 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  title="Remove"
                >
                  &#10005;
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
