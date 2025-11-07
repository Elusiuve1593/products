FROM node:18-bullseye AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y bash build-essential python3 libssl-dev

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .

RUN npx prisma generate --schema=./src/prisma/schema.prisma

RUN npm run build

FROM node:18-bullseye AS runner

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]

