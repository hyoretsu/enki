# syntax=docker/dockerfile:1.7

FROM oven/bun:1.3.12 AS deps

WORKDIR /app

COPY package.json bun.lock ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
COPY packages/sql/package.json packages/sql/package.json

RUN bun i --frozen-lockfile --linker=isolated

FROM deps AS build

WORKDIR /app

ENV NODE_ENV=production

COPY . .

RUN bunx turbo -F backend build

FROM alpine:latest AS runtime

WORKDIR /app

ENV NODE_ENV=production

# Bun's musl single-file executable still links libstdc++/libgcc at runtime.
RUN apk add --no-cache libstdc++ libgcc

RUN mkdir -p backend/static
COPY --from=build /app/backend/dist/server ./server

EXPOSE 3333

CMD ["./server"]
