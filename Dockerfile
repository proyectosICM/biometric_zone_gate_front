# ---------- Build stage ----------
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- Runtime stage ----------
FROM node:20-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3003

# Instala solo dependencias de prod (incluye express si está en dependencies)
COPY package*.json ./
RUN npm ci --omit=dev

# Copia el server y el build
COPY server.js ./
COPY --from=build /app/build ./build

EXPOSE 3003
CMD ["node", "server.js"]