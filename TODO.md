# TODO

## VideoGameRun / UserVideoGameRun

Entities + migration added (`20260613000000_create_video_game_run`). Still need:

- [ ] **Repository methods** (`backend/infra/sql/kysely/repositories/KyselyUsersRepository.ts`)
  - [ ] Create/list `VideoGameRun` kinds for a game.
  - [ ] Track (`upsert`) a `UserVideoGameRun` — user's playthrough of a run kind, with its own `timeSpent`/`score`/`when`.
- [ ] **HTTP routes** (`backend/infra/http/elysia/controllers/`)
  - [ ] Endpoints to create/list run kinds.
  - [ ] Endpoint to log/update a user run.
  - [ ] Wire `VideoGameRun` / `UserVideoGameRun` Elysia schemas (`backend/infra/http/elysia/types.ts`) into responses.

### Total game timeSpent — by design, runs are NOT summed
`UserVideoGame.timeSpent` is the grand total. `UserVideoGameRun` rows are a detailed
breakdown (subset), not additive. Example: UVG.timeSpent = 120 min, one run "main game"
= 70 min (the other 50 min is unbroken-down play). `getTimeSpent` correctly sums only
`UserVideoGame.timeSpent − offset` — leave it as is. Do NOT add run sums to the total.

### Pre-existing cleanup spotted nearby
- `getTimeSpent` VIDEO_GAME branch joins `Video` (not `VideoGame`) on `uvg.videoGameId` and
  never uses the joined `v.duration` — dead join, safe to drop.
