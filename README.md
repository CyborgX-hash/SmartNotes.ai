# AI Notes Assistant

AI-powered study tool — upload notes, ask questions with RAG retrieval, and generate practice quizzes.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | PostgreSQL + Prisma |
| Vector Search | pgvector |
| Embeddings | Xenova/all-MiniLM-L6-v2 (local) |
| LLM | Groq (Llama 3.3 70B) |
| Auth | JWT + bcryptjs |

## Prerequisites

- **Node.js** 18+
- **PostgreSQL** with **pgvector** extension (Supabase, Neon, Railway, or local with `CREATE EXTENSION vector`)

## Setup

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

```bash
# Backend — copy and edit
cp backend/.env.example backend/.env
# Set your DATABASE_URL, GROQ_API_KEY, and JWT_SECRET

# Frontend — copy and edit
cp frontend/.env.example frontend/.env
```

### 3. Database Setup

Make sure your PostgreSQL has pgvector enabled:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

Then run Prisma migrations:

```bash
cd backend
npx prisma migrate dev --name init
```

This creates all tables and the vector column.

> **Note:** If Prisma migration doesn't create the embedding column (due to `Unsupported` type), run this SQL manually:
> ```sql
> ALTER TABLE "NoteChunk" ADD COLUMN IF NOT EXISTS embedding vector(384);
> CREATE INDEX IF NOT EXISTS note_chunk_embedding_idx ON "NoteChunk" USING hnsw (embedding vector_cosine_ops);
> ```

### 4. Run

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API Health: http://localhost:5000/api/health

## Features

- **Auth**: Signup, login, JWT-based session, protected routes
- **Upload**: PDF and TXT files, auto-chunked and embedded
- **RAG Q&A**: Ask questions, get answers from your notes with source citations
- **Quiz Generator**: MCQ quizzes with adjustable difficulty, interactive answer reveal
- **Dashboard**: View all notes, status tracking, auto-refresh during processing

## API Endpoints

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/notes` | List user notes |
| POST | `/api/notes/upload` | Upload file |
| GET | `/api/notes/:id` | Get note |
| DELETE | `/api/notes/:id` | Delete note |
| POST | `/api/chat/:noteId/ask` | Ask question (RAG) |
| GET | `/api/chat/:noteId/history` | Chat history |
| POST | `/api/quiz/:noteId/generate` | Generate quiz |
| GET | `/api/quiz/:noteId/history` | Quiz history |

## Deployment

### Frontend (Vercel/Netlify)
- Build: `npm run build`
- Output: `dist/`
- Set `VITE_API_URL` to your backend URL

### Backend (Render/Railway)
- Build: `npm install`
- Start: `npm start`
- Set all env vars from `.env.example`
- Ensure PostgreSQL addon with pgvector support

## Project Structure

```
ai-notes/
├── frontend/          # React + Vite + Tailwind
│   └── src/
│       ├── api/       # API client layer
│       ├── components/# UI, layout, notes, chat, quiz
│       ├── contexts/  # Auth context
│       └── pages/     # Landing, Login, Signup, Dashboard, NoteWorkspace
├── backend/           # Express + Prisma
│   ├── prisma/        # Schema & migrations
│   └── src/
│       ├── config/    # Environment config
│       ├── controllers/
│       ├── lib/       # Prisma, Groq, file parser
│       ├── middleware/ # Auth, upload, validation, errors
│       ├── routes/
│       └── services/  # Core business logic
└── README.md
```
