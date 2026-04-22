# TIMS Education Website

Redesigned website for **Tirur Institute of Management Studies (TIMS)** built with Next.js 14, React, Tailwind CSS and MongoDB.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** MongoDB + Mongoose
- **Animations:** Framer Motion
- **Icons:** React Icons
- **Notifications:** React Hot Toast

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Edit `.env.local`:
```
MONGODB_URI=mongodb://localhost:27017/tims_education
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Seed Database (optional)
```bash
# Via API (dev only):
curl -X POST http://localhost:3000/api/seed
```

### 4. Run Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

## Pages

| Page | Route |
|------|-------|
| Home | `/` |
| About | `/about` |
| Courses/Programs | `/courses` |
| Universities | `/universities` |
| Blog | `/blog` |
| Students Corner | `/students` |
| Contact | `/contact` |

## API Routes

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/api/contact` | POST, GET | Contact form submissions |
| `/api/courses` | POST, GET | Courses/programs |
| `/api/testimonials` | POST, GET | Student testimonials |
| `/api/blog` | POST, GET | Blog posts |
| `/api/seed` | POST | Seed database (dev only) |

## Project Structure

```
src/
├── app/              # Next.js App Router pages + API routes
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── sections/     # Home page section components
├── lib/
│   ├── mongodb.ts    # DB connection
│   ├── data.ts       # Static content (courses, universities, etc.)
│   └── seed.ts       # DB seed script
└── models/           # Mongoose models
    ├── Course.ts
    ├── Testimonial.ts
    ├── Contact.ts
    └── BlogPost.ts
```

## Design Reference

- **Content:** [timseducation.com](https://timseducation.com)
- **Design Pattern:** [edufolio.org](https://edufolio.org)
- **Color Theme:** Dark navy (`#1e3a5f`) + Sky blue + Amber accent
