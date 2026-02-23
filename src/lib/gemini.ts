import { GoogleGenerativeAI, Part } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");

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

export interface GenerateStoriesRequest {
  images: { base64: string; mimeType: string }[];
  context: string;
  storyType: string;
}

export async function generateStories(
  request: GenerateStoriesRequest
): Promise<StorySuggestion[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const imageParts: Part[] = request.images.map((img) => ({
    inlineData: {
      data: img.base64,
      mimeType: img.mimeType,
    },
  }));

  const prompt = `You are a creative social media storytelling expert. Analyze these ${request.images.length} images and create compelling story suggestions for a social media story (like Instagram Stories).

Context: ${request.context}
Story type: ${request.storyType}

IMPORTANT RULES:
- Each image must tell a part of the story, like panels in a comic book
- The story should flow naturally from one image to the next
- Captions should be short, punchy, and engaging (max 10 words per caption)
- The narrative should hook viewers from the first frame
- Use the actual content visible in the images to craft authentic stories

Generate exactly 3 different story suggestions. Each suggestion should use ALL ${request.images.length} images in a deliberate order that creates the best narrative flow. You can reorder the images if needed.

Respond in this exact JSON format (no markdown, no code blocks, just raw JSON):
[
  {
    "title": "Story title (short, catchy)",
    "theme": "One word theme like: adventure, discovery, transformation, celebration",
    "frames": [
      {
        "imageIndex": 0,
        "caption": "Short punchy caption for this frame",
        "narrativeText": "Slightly longer description of what this frame conveys in the story (1-2 sentences)"
      }
    ],
    "hookText": "Opening hook text to grab attention",
    "closingText": "Closing CTA or memorable ending line"
  }
]

Each story must have exactly ${request.images.length} frames (one per image). imageIndex refers to the 0-based index of the input images.`;

  const result = await model.generateContent([...imageParts, prompt]);
  const response = result.response;
  const text = response.text();

  // Parse the JSON response, handling potential markdown code blocks
  let jsonStr = text.trim();
  if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  const stories: StorySuggestion[] = JSON.parse(jsonStr);
  return stories;
}

export async function analyzeImageForPreview(
  image: { base64: string; mimeType: string },
  caption: string
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent([
    {
      inlineData: {
        data: image.base64,
        mimeType: image.mimeType,
      },
    },
    `Describe the dominant colors and mood of this image in 3-4 words, like "warm golden sunset" or "cool blue urban". This will be used to style a caption overlay. Just respond with the description, nothing else.`,
  ]);

  return result.response.text().trim();
}
