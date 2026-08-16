# NextBlog

NextBlog is a small full-stack blog built for students learning the Next.js App Router. It includes public articles, authentication, a writer dashboard, MongoDB CRUD operations, form validation, loading and error states, tests, and practical SEO.

## What students learn

### 1. Project foundation

- App Router folder structure and reusable components
- Route Handler APIs under `app/api`
- A responsive homepage and dynamic article list
- TanStack Query for fetching, caching, loading, and error states

### 2. Authentication and post management

- Signup, login, logout, and an HTTP-only JWT cookie
- Protected dashboard routes
- Create, read, update, and delete operations with MongoDB and Mongoose
- React Hook Form validation for every form
- Ownership checks so writers can only change their own posts
- Draft and published article states

### 3. Polish, testing, and SEO

- Search, tags, reading time, sharing, empty states, and error pages
- Small unit tests using Node's built-in test runner
- Titles, descriptions, canonical URLs, Open Graph, and JSON-LD
- Dynamic `sitemap.xml`, `robots.txt`, and `llms.txt` for search engines and agents

## Project structure

```text
app/
  api/                 # Backend route handlers
  dashboard/           # Protected writer pages
  posts/[id]/          # Server-rendered article page
  layout.js            # Shared page shell and metadata
  page.js              # Homepage
components/            # Reusable UI and form components
lib/
  models/              # Mongoose models
  api.js                # Browser API helper functions
  auth.js               # JWT and cookie helpers
  db.js                 # Cached MongoDB connection
  post-utils.mjs        # Small tested helper functions
tests/                  # Unit tests
```

## Run locally

1. Install Node.js 20 or newer and start a local MongoDB server, or create a MongoDB Atlas database.
2. Install packages:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env.local` and update the values:

   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/nextblog
   JWT_SECRET=use-a-long-random-secret-here
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000), create an account, and publish the first post.

## Useful commands

```bash
npm run dev      # Start the development server
npm run lint     # Check code quality
npm test         # Run unit tests
npm run build    # Create a production build
npm start        # Run the production build
```

## API overview

| Method | Route | Purpose | Login required |
| --- | --- | --- | --- |
| `GET` | `/api/posts` | List published posts | No |
| `GET` | `/api/posts?mine=true` | List the current writer's posts | Yes |
| `POST` | `/api/posts` | Create a post | Yes |
| `GET` | `/api/posts/:id` | Read a visible post | Drafts only for owner |
| `PUT` | `/api/posts/:id` | Update an owned post | Yes |
| `DELETE` | `/api/posts/:id` | Delete an owned post | Yes |
| `POST` | `/api/auth/signup` | Create an account | No |
| `POST` | `/api/auth/login` | Log in | No |
| `POST` | `/api/auth/logout` | Log out | No |
| `GET` | `/api/auth/me` | Read the current user | Yes |

## Beginner-friendly design choices

- Route Handlers keep the frontend and backend in one Next.js project.
- JWT authentication is intentionally small and visible instead of hidden behind a large auth library.
- TanStack Query handles server data; React Hook Form handles form state. Each library has one clear job.
- Articles use plain text with preserved line breaks. A rich-text editor can be a later lesson.
- API routes repeat a little validation so students can follow each request without learning an abstraction first.

Before deployment, set `NEXT_PUBLIC_SITE_URL` to the real HTTPS address so canonical links, the sitemap, sharing, and structured data use the production URL.
