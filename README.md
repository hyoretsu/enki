# enki

Track everything you read, watch and play — literary works (and their chapters), movies, YouTube videos and video games.

## Stack

- **Backend** (`backend/`): [Bun](https://bun.sh) + [Elysia](https://elysiajs.com), [Prisma Next](https://github.com/prisma/prisma-next) (contract-first data layer: `db.orm` for everyday queries, `db.sql` query-builder plans for joins/aggregates) and [Better Auth](https://better-auth.com) (email + password sessions).
- **Frontend** (`frontend/`): [Tauri 2](https://tauri.app) (desktop + iOS/Android) wrapping a React 19 + Vite app — TanStack Router/Query, Tailwind CSS v4, i18next (en-US, pt-PT) and a [Kubb](https://kubb.dev)-generated typed SDK from the backend's OpenAPI schema.

## Backend

```sh
bun install
cp backend/infra/.env.example backend/infra/.env  # fill it in

cd backend/infra
bun run emit      # emit the Prisma Next contract (after editing sql/prisma/contract.prisma)
bun run db:init   # baseline an empty database (writes the marker) and apply migrations
bun run dev       # http://localhost:3333 (docs at /docs)
```

Schema changes: edit `sql/prisma/contract.prisma` → `bun run emit` → `bun run migrate:plan` → `bun run migrate` (or `bun run db:update` against a throwaway local database).

### Migrating a legacy (TSID) database

Databases created before the Prisma Next rewrite (PascalCase tables, BigInt TSID ids, password column on `User`) are migrated in place — ids become UUIDs and users move to Better Auth's tables, keeping their bcrypt passwords:

```sh
cd backend/infra
bun run db:init        # signs the database and creates the new tables alongside the old ones
bun run migrate:legacy # copies + remaps all data, then drops the legacy schema
```

### Auth

Authentication is handled by Better Auth, mounted at `/auth/*` (`POST /auth/sign-up/email`, `POST /auth/sign-in/email`, ...). `POST /media/track` and `GET /users/stats` resolve the user from the session cookie — there is no `userId` parameter anymore.

## Frontend

```sh
cp frontend/.env.example frontend/.env

cd frontend
bun dev            # web at http://localhost:5173
bun tauri:dev      # desktop app
bun tauri:android  # Android (needs the Android SDK/NDK)
bun tauri:ios      # iOS (needs Xcode)
```

After changing backend routes, regenerate the SDK:

```sh
bun --cwd backend/infra export  # writes backend/infra/generated/openapi.json
bun --cwd frontend sdk:generate # regenerates frontend/src/lib/api/generated
```
