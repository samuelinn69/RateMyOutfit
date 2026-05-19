# RateMyOutfit 👑

> The AI-powered fashion judge that tells you the truth your friends won't.

**Rate your outfit in seconds with GPT-4o Vision.** Get scores, vibe analysis, color palettes, style tips, accessory suggestions, a roast, and more — then share your results with the world.

![RateMyOutfit Banner](https://placehold.co/1200x400/1a1a2e/a855f7?text=RateMyOutfit+%E2%80%94+AI+Fashion+Judge&font=montserrat)

---

## What it does

Upload a photo of your outfit → AI analyzes it → You get:

| Feature | Details |
|---|---|
| **Score** | 1–10 overall + 4 sub-dimensions |
| **Vibe** | Old Money, Streetwear, Y2K, Quiet Luxury, and 15+ more |
| **Colors** | Complementary hex palette + clash warnings |
| **Roast** | Optional brutal-but-loving takedown |
| **Social tips** | How the outfit plays in dating/social contexts |
| **Attractiveness boost** | Perceived attractiveness % |
| **Accessories** | What to add to complete the look |
| **Hairstyle** | Best hairstyles to match the fit |

---

## Tech Stack

### Frontend
- **Next.js 15** (App Router, Turbopack)
- **TypeScript** · **TailwindCSS** · **Framer Motion**
- **Zustand** (state management)
- **shadcn/ui** + Radix UI primitives
- **Axios** with automatic token refresh

### Backend
- **Node.js** · **Express** · **TypeScript**
- **Prisma** ORM + **PostgreSQL**
- **OpenAI GPT-4o Vision** API
- **Cloudinary** (image storage & optimization)
- **JWT** auth (access + refresh tokens)
- **Zod** validation · **Helmet** · Rate limiting

### Infrastructure
- **Docker** + Docker Compose
- **Koyeb** (deployment)
- External **PostgreSQL** (Neon / Supabase / Railway)

---

## Project Structure

```
RateMyOutfit/
├── frontend/               # Next.js 15 app
│   ├── app/
│   │   ├── (auth)/        # login, register
│   │   ├── (main)/        # dashboard, upload, feed, profile, outfit
│   │   └── page.tsx       # Landing page
│   ├── components/
│   │   ├── landing/       # Landing sections
│   │   ├── outfit/        # Outfit components
│   │   ├── shared/        # Navbar, etc.
│   │   └── ui/            # Design system
│   ├── lib/               # API client, utils, types
│   ├── store/             # Zustand stores
│   └── Dockerfile
│
├── backend/                # Express API
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/    # Auth, errors, upload
│   │   ├── routes/        # API routes
│   │   ├── services/      # AI, auth business logic
│   │   ├── lib/           # Prisma, OpenAI, Cloudinary
│   │   └── utils/         # JWT, validators
│   ├── prisma/
│   │   └── schema.prisma  # Full DB schema
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database
- OpenAI API key (GPT-4o access)
- Cloudinary account

### 1. Clone the repo
```bash
git clone https://github.com/samuelinn69/RateMyOutfit.git
cd RateMyOutfit
```

### 2. Backend setup
```bash
cd backend
cp .env.example .env
# Fill in your env variables
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### 3. Frontend setup
```bash
cd frontend
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:4000
npm install
npm run dev
```

---

## Environment Variables

### Backend (`backend/.env`)
```env
NODE_ENV=development
PORT=4000

# PostgreSQL
DATABASE_URL=postgresql://user:pass@host:5432/ratemyoutfit

# JWT - generate strong random secrets for production
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# OpenAI (needs GPT-4o access)
OPENAI_API_KEY=sk-...

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# CORS
FRONTEND_URL=http://localhost:3000
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Docker

### Run the full stack locally
```bash
# Copy env files first
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit with your real credentials, then:
docker-compose up --build
```

App will be at `http://localhost:3000` · API at `http://localhost:4000`

---

## Deploy on Koyeb

### Database
1. Create a PostgreSQL database on [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app)
2. Copy the connection string

### Backend service
1. Go to [Koyeb](https://koyeb.com) → Create service → Docker
2. Connect your GitHub repo
3. Set **Root directory**: `backend`
4. Set **Dockerfile path**: `backend/Dockerfile`
5. Add env vars:
   - `DATABASE_URL` → your PostgreSQL URL
   - `JWT_SECRET` → strong random string
   - `JWT_REFRESH_SECRET` → different strong random string
   - `OPENAI_API_KEY` → your OpenAI key
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `FRONTEND_URL` → your frontend Koyeb URL
   - `NODE_ENV=production`
6. Set **Port**: `4000`
7. Deploy → copy the service URL

### Frontend service
1. Create another Koyeb service → Docker
2. Set **Root directory**: `frontend`
3. Set **Dockerfile path**: `frontend/Dockerfile`
4. Add env vars:
   - `NEXT_PUBLIC_API_URL` → your backend Koyeb URL
5. Set **Port**: `3000`
6. Deploy

---

## API Reference

```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login
POST   /api/auth/refresh           Refresh access token
POST   /api/auth/logout            Logout

POST   /api/outfits                Upload & analyze outfit (multipart)
GET    /api/outfits/:id            Get outfit details
DELETE /api/outfits/:id            Delete outfit
POST   /api/outfits/:id/like       Toggle like
GET    /api/outfits/user/:username Get user's outfits

GET    /api/feed                   Public feed (?sort=latest|trending|top)
GET    /api/feed/trending          Trending outfits
GET    /api/feed/leaderboard       Top-scored users

GET    /api/users/me               Current user profile
PUT    /api/users/me               Update profile
GET    /api/users/:username        Public profile
```

---

## Key Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run type-check       # TypeScript check

# Database
npx prisma studio        # Visual DB browser
npx prisma migrate dev   # Create migration
npx prisma db push       # Push schema changes

# Docker
docker-compose up --build     # Start all services
docker-compose down           # Stop services
docker-compose logs -f        # Follow logs
```

---

## Roadmap

- [ ] Outfit battles (A vs B voting)
- [ ] Daily fashion tips from AI
- [ ] Outfit favorites / collections
- [ ] Push notifications
- [ ] AI personal stylist chat
- [ ] Brand recognition
- [ ] Video outfit analysis

---

## License

MIT © 2026 RateMyOutfit

---

<div align="center">
  Built with 💜 and GPT-4o. No sugarcoating.
</div>
