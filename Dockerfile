FROM oven/bun AS backend_build

WORKDIR /app

# Create necessary directories
RUN mkdir -p ./backend/application ./backend/domain ./backend/infra

# Copy dependency files
COPY bun.lockb package.json ./
COPY backend/application/package.json ./backend/application
COPY backend/domain/package.json ./backend/domain
COPY backend/infra/package.json ./backend/infra

# Install dependencies
RUN bun install --ignore-scripts

# Copy backend source code
COPY ./backend ./backend

ENV NODE_ENV=production

# Build the backend from infra module
RUN bun run --filter "@enki/infra" build

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
