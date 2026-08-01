# --- Build Stage ---
FROM node:20-alpine AS builder
WORKDIR /usr/app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# --- Nginx Runtime Stage ---
FROM nginx:1.27-alpine AS runtime
WORKDIR /usr/share/nginx/html

# Remove default Nginx content
RUN rm -rf ./*

# Copy build output
COPY --from=builder /usr/app/build .

# Copy custom Nginx config for SPA
COPY --from=builder /usr/app/nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy entrypoint
COPY --from=builder /usr/app/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80
CMD ["/entrypoint.sh"]
