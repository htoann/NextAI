# Next15AI

A **Next.js 15** AI + Booking System app using **Google Gemini**, **RabbitMQ**, **MongoDB**, and **Redis**.

Live: [`next15-ai.vercel.app`](https://next15-ai.vercel.app)

## Features

### ✅ Next.js 15 App (Page Router)

- React 19, Turbopack, caching, `<Form>`, and new async APIs
- Styled with optimized `next/font` (Geist)
- TypeScript-first

### 🤖 Gemini AI Integration

- Gemini API via REST POST endpoint (`/api/gemini`)
- Accepts prompt input and returns model-generated responses
- Uses `gemini-1.5-flash` model

### 🪑 Booking System (Fullstack)

- Seats booking with unique `bookingId` + `messageId` for idempotency
- MongoDB used for persistent bookings
- Redis for temporary seat lock logic
- Handles booking conflicts and concurrency

### 📩 RabbitMQ + Worker

- Bookings pushed to RabbitMQ queue
- `worker.ts` processes each message (deduplicates, validates, stores)
- Implements retry logic with headers
- Failed bookings go to **dead-letter queue** (`booking_deadlockqueue`)
- MongoDB/Redis connected in worker
- Upstash Redis, Cloudamqp

---

## Project Structure

```
/
├── app/                  # Next.js Page Router
│   └── api/              # API endpoints (e.g., gemini route)
├── lib/                  # Shared modules (RabbitMQ, Redis, DB)
├── api-models/           # Mongoose schema (Booking)
├── worker/               # RabbitMQ booking worker (worker.ts)
├── public/
├── types/                # Type definitions
├── utils/                # Constants (e.g., queue name, delay)
├── .env.local            # Your secrets (not committed)
└── README.md
```

---

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/htoann/Next15AI.git
cd Next15AI
pnpm install
```

### 2. Configure `.env.local`

```env
RABBIT_URL=amqp://localhost
MONGODB_URI=mongodb://localhost:27017/next15ai
REDIS_URL=redis://localhost:6379
GEMINI_API_KEY=your_google_gemini_key
```

### 3. Run Dev Server

```bash
pnpm dev
```

### 4. Start Worker

```bash
pnpm start:worker
```

---

## API Overview

### `POST /api/booking`

Queue a booking to RabbitMQ

### `worker.ts`

Processes messages from queue with retry and DLQ fallback

### `POST /api/gemini`

Handles AI prompts, calls Gemini API

---

## Booking Logic Highlights

- Seat IDs locked via Redis to prevent race conditions
- Retry count tracked in message headers
- `bookingId` and `messageId` used for idempotency
- Errors routed to `booking_deadlockqueue` after `MAX_RETRIES`

---

## License

MIT
