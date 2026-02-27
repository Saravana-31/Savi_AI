# --------- 1️⃣ Build Stage ---------
FROM node:18-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

# Build environment variables
ARG MONGODB_URI=mongodb://localhost:27017/build
ENV MONGODB_URI=$MONGODB_URI

RUN pnpm build


# --------- 2️⃣ Production Stage ---------
FROM node:18-alpine

WORKDIR /app

RUN npm install -g pnpm

# Copy from builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/app ./app
COPY --from=builder /app/components ./components
COPY --from=builder /app/hooks ./hooks
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/next.config.mjs ./
EXPOSE 3000

CMD ["pnpm", "start"]