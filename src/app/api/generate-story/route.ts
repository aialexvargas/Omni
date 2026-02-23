import { NextRequest, NextResponse } from "next/server";
import { generateStories } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { images, context, storyType } = body;

    if (!images || images.length === 0) {
      return NextResponse.json(
        { error: "At least one image is required" },
        { status: 400 }
      );
    }

    if (images.length > 10) {
      return NextResponse.json(
        { error: "Maximum 10 images allowed" },
        { status: 400 }
      );
    }

    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GOOGLE_GEMINI_API_KEY is not configured. Add it to your .env file." },
        { status: 500 }
      );
    }

    const stories = await generateStories({
      images,
      context: context || "Create an engaging social media story",
      storyType: storyType || "lifestyle",
    });

    return NextResponse.json({ stories });
  } catch (error: unknown) {
    console.error("Story generation error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate stories";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
