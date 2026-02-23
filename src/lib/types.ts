export interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  base64: string;
  mimeType: string;
}

export interface StoryFrame {
  imageIndex: number;
  caption: string;
  narrativeText: string;
}

export interface StorySuggestion {
  title: string;
  theme: string;
  frames: StoryFrame[];
  hookText: string;
  closingText: string;
}

export type StoryType =
  | "trip"
  | "commercial"
  | "product"
  | "event"
  | "lifestyle";

export const STORY_TYPES: { value: StoryType; label: string; icon: string }[] =
  [
    { value: "trip", label: "Travel / Trip", icon: "plane" },
    { value: "commercial", label: "Commercial / Ad", icon: "megaphone" },
    { value: "product", label: "Product Showcase", icon: "package" },
    { value: "event", label: "Event Coverage", icon: "calendar" },
    { value: "lifestyle", label: "Lifestyle / Personal", icon: "heart" },
  ];
