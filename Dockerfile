FROM oven/bun AS backend_build

WORKDIR /app

# Copy dependency manifests (root + the workspaces the backend needs)
COPY bun.lock package.json ./
COPY backend/package.json ./backend/package.json
COPY packages/sql/package.json ./packages/sql/package.json

# Install dependencies
RUN bun install --ignore-scripts

# Copy source code
COPY ./backend ./backend
COPY ./packages ./packages

ENV NODE_ENV=production

# Compile the backend into a single self-contained binary
RUN bun run --filter backend build

FROM gcr.io/distroless/base AS backend

WORKDIR /app

# Copy the built server from the build stage
COPY --from=backend_build /app/backend/dist/server .

ENV NODE_ENV=production

# Create a non-root user and switch to it
USER 1000:1000

# Define the entry point
CMD ["./server"]

# Expose the application port
EXPOSE $PORT
