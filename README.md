# Next15AI

A **Next.js 15** AI-powered demo integrating **Google Gemini** — built with TypeScript using the latest features of Next.js.

Deployed live at: **`https://next15-ai.vercel.app`**

## Features

- Powered by **Next.js 15** (React 19 support, Turbopack, App Router, async request APIs, new `<Form>`, caching semantics)
- Integration with **Google Gemini AI** for generative tasks
- Styled with the Geist font via `next/font` for optimization
- Implemented in **TypeScript**, with project organized around `app/`, `src/`, and `public/`

## Getting Started

### Prerequisites

- Node.js v18+ / npm or Yarn / pnpm / Bun

### Installation

```bash
git clone https://github.com/htoann/Next15AI.git
cd Next15AI
pnpm install    # or npm install / yarn
```

### Development

```bash
pnpm dev        # or npm run dev / yarn dev / bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view locally.

### Build & Production

```bash
pnpm build
pnpm start
```

## Project Structure

```
/
├── public/
├── src/
├── app/
│   └── page.tsx
├── .eslintrc, .prettierrc
├── next.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## Integration: Google Gemini AI

- Use `@google/generative-ai` client or similar to call Gemini models (e.g. `gemini-2.0-flash-001`)
- Setup a `POST` API route under `app/api/gemini/route.ts` to relay prompts and return generated responses
- On frontend (`app/page.tsx`), fetch and display AI-generated content (potentially parsed via Markdown rendering)

> *Note: API key and actual implementation details assumed but not verified in repo.*

## Learn More

- Next.js 15 blog and upgrade guide, covering Turbopack, async APIs, React 19, caching defaults, `<Form>`, instrumentation, etc.
- Tutorials on integrating Gemini AI with Next.js 15 and Tailwind CSS provide sample patterns for real-time chat and translation features

## License

MIT

## To Improve / Contribute

- Verify actual Gemini model integration and API structure, update sections above with correct paths.
- Add instructions on deploying keys and env vars (`.env.local`)
- Implement a chat UI, state management, or storage backend if not present.
- Polish UI/UX and add real-time features if intended.