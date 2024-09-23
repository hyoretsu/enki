FROM oven/bun AS backend_build

WORKDIR /app

RUN mkdir -p ./backend/application ./backend/domain ./backend/infra

COPY bun.lockb package.json ./
COPY backend/application/package.json ./backend/application
COPY backend/domain/package.json ./backend/domain
COPY backend/infra/package.json ./backend/infra

RUN bun install --ignore-scripts

COPY ./backend ./backend

ENV NODE_ENV=production

RUN bun run --filter "@enki/infra" build

FROM gcr.io/distroless/base AS backend

WORKDIR /app

COPY --from=backend_build /app/backend/dist/server server

ENV NODE_ENV=production

CMD ["./server"]

EXPOSE $PORT
