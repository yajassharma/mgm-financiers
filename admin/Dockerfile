FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --frozen-lockfile
COPY . .
ARG VITE_APP_BASE_URL
ARG VITE_APP_AUTH_NAME
ENV VITE_APP_BASE_URL=$VITE_APP_BASE_URL
ENV VITE_APP_AUTH_NAME=$VITE_APP_AUTH_NAME
RUN npm run build

FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/build .
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
