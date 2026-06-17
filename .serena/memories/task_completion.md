# Task completion checklist
- Keep edits scoped to requested change; avoid unrelated refactors.
- Run affected checks before staging/merge work: type-check and build for affected packages.
- For route file changes, rebuild so TanStack routeTree.gen.ts regenerates.
- For backend endpoint/DTO changes, run backend export then frontend generate when SDK needs updating.
- For Prisma Next contract/schema changes, run `cd packages/sql && bun run export` if contract artifacts must update.
- After a completed code task, create local git commit with Conventional Commit message and Codex author: `git -c commit.gpgsign=false -c user.name="Aran Leite" -c user.email="hyoretsu@gmail.com" commit --author="Codex <noreply@openai.com>"`.
- Never push, deploy, trigger remote jobs, or run migrations against remote DB unless explicitly requested for that instance.