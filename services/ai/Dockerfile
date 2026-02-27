# --------- AI Service Dockerfile ---------
FROM node:18-alpine

WORKDIR /app

RUN npm install -g pnpm

# Copy service files
COPY package.json ./
COPY index.js ./

# Install production dependencies only
RUN pnpm install --prod

EXPOSE 5000

CMD ["node", "index.js"]
