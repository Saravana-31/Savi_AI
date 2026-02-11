# --------- 1️⃣ Build Stage ---------
FROM node:18-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

# 👇 Add this line
ARG MONGODB_URI
ENV MONGODB_URI=$MONGODB_URI

RUN pnpm build


# --------- 2️⃣ Production Stage ---------
FROM node:18-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY --from=builder /app ./

EXPOSE 3000

CMD ["pnpm", "start"]
