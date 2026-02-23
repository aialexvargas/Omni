# Omni - AI Story Generator

Turn your photos into compelling social media stories with AI-powered comic-book style narratives.

## What it does

Upload a batch of photos (from a trip, product shoot, event, etc.) and Omni uses Google Gemini to:

1. **Analyze your images** - Understands the content, mood, and context of each photo
2. **Craft story narratives** - Generates 3 different story suggestions, each arranging your photos into a sequential narrative
3. **Comic-book layout** - Presents each story as a comic-book style grid where every frame has a punchy caption
4. **Export as image** - Download the finished story layout as a PNG to post on social media

## Getting Started

### Prerequisites

- Node.js 18+
- A Google Gemini API key ([get one here](https://aistudio.google.com/apikey))

### Setup

```bash
npm install
cp .env.example .env
```

Edit `.env` and add your Gemini API key:

```
GOOGLE_GEMINI_API_KEY=your_api_key_here
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

- **Next.js 16** with App Router
- **TypeScript**
- **Tailwind CSS v4**
- **Google Gemini 2.0 Flash** for multimodal image analysis and story generation
- **html2canvas** for client-side export

## How It Works

1. Upload 2-10 photos via drag-and-drop
2. Select a story type (Travel, Commercial, Product, Event, Lifestyle)
3. Optionally add context describing what the photos are about
4. Hit "Generate Stories" - Gemini analyzes all images together and creates 3 story variations
5. Each story is displayed as a comic-book grid with numbered frames and captions
6. Export any story as a PNG image
