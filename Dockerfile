# ── Stage 1: Build Vue 3 app ──────────────────
FROM node:20-alpine AS build-stage

WORKDIR /app

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Install dependencies (layer-cached)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source & build
COPY . .
RUN npm run build

# ── Stage 2: Serve with Nginx ──────────────────
FROM nginx:stable-alpine AS production-stage

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built app from Stage 1
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
