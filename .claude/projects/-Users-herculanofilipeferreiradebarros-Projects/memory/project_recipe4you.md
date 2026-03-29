# recipe4you — Project Memory

## Stack

- **Monorepo**: Turborepo + pnpm 9 workspaces
- **Frontend**: React 19 + Vite + TypeScript (`apps/web/`)
- **Backend**: Fastify 5 + Prisma 6 + TypeScript (`apps/api/`)
- **Shared types**: `@recipe4you/types` (`packages/types/src/`)
- **Styling**: MUI v7 + styled-components v6 (`StyledEngineProvider injectFirst`)
- **Forms**: react-hook-form + zod + @hookform/resolvers
- **State**: Zustand (authStore, uiStore) + TanStack Query
- **Auth**: Supabase Auth + custom JWT (15m access / 7d refresh) + Redis revocation
- **DB**: Supabase PostgreSQL (via Prisma)
- **Storage**: Supabase Storage (recipe-images, avatars buckets)
- **Queue**: BullMQ + Upstash Redis TCP
- **Cache**: Upstash Redis REST
- **AI**: Anthropic claude-opus-4-6
- **Billing**: Stripe subscriptions

## Key Architecture Decisions

### Web app conventions

- Every page and component uses a **folder-per-feature** pattern:
  - `index.ts` — re-exports only (`export { default } from "./PageName.js"`)
  - `TypeName.types.ts` — TypeScript interfaces / zod schemas
  - `TypeName.utils.ts` — helper functions (if needed)
  - `TypeName.styled.ts` — ALL styled-components (no inline `styled.xxx` in JSX)
  - `TypeName.tsx` — component JSX only
- All imports use `.js` extensions (ESM TypeScript)
- Pages use `../../` prefix (depth 2 from `pages/X/X.tsx`)
- Components use `../` or `../../` depending on location

### MUI v7 notes

- Grid: NO `item`/`xs`/`md` props — use `size={{ xs: 12, md: 6 }}`
- Import from `react-router` (NOT `react-router-dom`)
- `StyledEngineProvider injectFirst` wraps entire app so styled-components wins specificity

### Zod + react-hook-form

- When schema uses `z.preprocess()` (e.g. optional numbers), cast resolver: `zodResolver(schema) as any`
- Use `z.default()` sparingly — causes input/output type mismatch with `useForm<T>`

### Transient props convention

- Props that shouldn't reach the DOM are prefixed with `$` (e.g. `$active`, `$featured`)

## Environment & Infrastructure

### .env location

- Single root `.env` for entire monorepo
- API server loads it via `config({ path: "../../.env" })` in `server.ts`
- Vite picks it up via `envDir: "../../"` in `vite.config.ts`

### Database

- `DATABASE_URL`: Direct connection `postgresql://postgres:PASS@db.{ref}.supabase.co:5432/postgres`
- `DIRECT_URL`: Same direct connection (pooler URL `pooler.supabase.com:6543` gives "Tenant not found" error in development)
- Run migrations: `pnpm --filter api db:migrate`
- Run seed: `pnpm --filter api db:seed` (from repo root — seed.ts loads `../../.env`)
- Seed script is at `apps/api/prisma/seed.ts`

### Deployment

- API → Fly.io via GitHub Actions (`.github/workflows/fly-api.yml`)
- Fly config: `apps/api/fly.toml` (app name: `recipe4you-api`, region: `fra`, port: 8080)
- Dockerfile: `apps/api/Dockerfile` (3-stage: deps → builder → runner, Node 22 Alpine)
- Build context: REPO ROOT (`fly deploy --config apps/api/fly.toml`)
- Release command: `./node_modules/.bin/prisma migrate deploy`
- Secrets set via: `fly secrets set --app recipe4you-api KEY=value`
- Web app → TBD (Vercel/Netlify recommended)

### Turbo

- `globalDotEnv` key removed in Turbo v2 — do not add it back to `turbo.json`

## File Structure Highlights

```
apps/
  api/
    prisma/
      schema.prisma       — all models
      seed.ts             — comprehensive seed data
    src/
      server.ts           — Fastify entry, loads dotenv from ../../.env
      routes/             — auth, recipes, favorites, collections, search, users, tags, ingredients, upload, ai, billing
      services/           — aiService, cacheService, externalApi, jobService, stripeService
      plugins/            — cors, auth, rateLimit, swagger
      lib/                — prisma, redis (Upstash REST), supabase, logger
      jobs/               — emailNotification.worker.ts
    eslint.config.js      — ESLint v9 flat config (created — was missing)
    fly.toml              — Fly.io deploy config
    Dockerfile            — 3-stage monorepo Docker build
  web/
    src/
      components/
        auth/AuthShell/   — shared auth layout + FooterRow/FooterLink/TermsNote/FormStack
        ui/               — AppButton, AppTextField, AppPasswordField, AppAlert, DifficultyChip, UserAvatar, PageContainer, StubPage
        recipe/           — RecipeCard, RecipeGrid
        search/           — SearchBar
        premium/          — PremiumGate
        layout/           — Header, Footer, SkipLink
      pages/              — all 20 pages in folder structure (Login, Register, ForgotPassword, Home, Discover, Search, RecipeDetail, RecipeCreate, RecipeEdit, NotFound, Premium, Billing, AiAssistant, Favorites, Collections, CollectionDetail, Profile, PublicProfile, Settings, Tag)
      hooks/              — useAuth, useRecipes, useRecipeDetail, useFavorites, useFavoritesList, useSearch, useSubscription, useCollections, useProfile, useTag, useTags, useIngredients, useRecipeMutations, useUpload, useSessionInit
      store/              — authStore (persisted, stores user+token+isAuthenticated+refreshToken), uiStore
      lib/                — api.ts (fetch wrapper with 401→refresh→retry), queryClient.ts, supabase.ts
      router/             — index.tsx (all 20 lazy-loaded pages)
      layouts/            — RootLayout, ProtectedLayout, AuthLayout
    eslint.config.js      — React + hooks + a11y + TypeScript rules
    vite.config.ts        — envDir: "../../", PWA plugin
.github/
  workflows/
    fly-api.yml           — auto-deploy API to Fly.io on push to main
.dockerignore             — repo root, excludes node_modules, dist, .env, .git
.lintstagedrc.mjs         — pre-commit: ESLint --fix + prettier on web/src, prettier on api/src + packages
turbo.json                — build, dev, lint, type-check, test tasks (NO globalDotEnv)
```

## API Endpoints Summary

- `POST /api/v1/auth/login|register|refresh|logout`
- `GET|POST|PATCH|DELETE /api/v1/recipes` + ratings, publish
- `GET|POST|DELETE /api/v1/favorites/:recipeId`
- `GET|POST|PATCH|DELETE /api/v1/collections/:id` + recipes
- `GET /api/v1/search?q=` + `/suggestions`
- `GET|PATCH /api/v1/users/me`, `GET /api/v1/users/:username`
- `GET /api/v1/tags`, `GET /api/v1/tags/:slug`
- `GET /api/v1/ingredients?q=`
- `POST /api/v1/upload/recipe-image|avatar`
- `POST /api/v1/ai/generate-recipe|estimate-nutrition|meal-plan|improve-recipe` (auth + premium)
- `GET|POST /api/v1/billing/status|checkout|portal|webhook`

## Auth Flow (Web)

- `api.ts`: 401 → call `POST /auth/refresh` → retry original request → if refresh fails: dispatch `auth:logout` custom event + clear localStorage
- `authStore`: persists user/token/isAuthenticated to localStorage
- Refresh token stored in `localStorage` key `refresh_token`
- `useLogout`: calls `POST /auth/logout` (server revokes JTI) then `clearAuth()`
- `ProtectedLayout`: checks `isAuthenticated` from Zustand, redirects to `/auth/login` if false

## Known Issues / Gotchas

- Supabase pooler URL (port 6543, `pooler.supabase.com`) gives "Tenant or user not found" — use direct connection `db.{ref}.supabase.co:5432`
- `react-hooks/set-state-in-effect` disable comment needed in `Search.tsx` useEffect (syncing controlled input to URL params)
- `react-hooks/incompatible-library` disable needed on `watch()` calls in RecipeCreate, RecipeEdit, Settings (react-hook-form incompatibility with React Compiler)
- Password URL-encoding: `$` → `%24`, `&` → `%26` in DATABASE_URL/DIRECT_URL
- Lint-staged lints STAGED files — always `git add .` before committing to avoid stale staged content failures

## Pending / Not Yet Done

- Stripe, Anthropic, Upstash Redis env vars still placeholder — need to be filled in `.env`
- JWT_SECRET and REFRESH_TOKEN_SECRET still placeholder — need real 48-char random values
- Web app deployment (Vercel/Netlify) not yet set up
- Stripe webhook URL not yet configured in Stripe dashboard
