# Stage 1: Build aplikasi Vite
FROM node:20-alpine AS builder
WORKDIR /app

# Aktifkan pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Salin file dependensi
COPY package.json pnpm-lock.yaml ./

# Install semua dependency (tanpa dev dependency di layer berikutnya)
RUN pnpm install --frozen-lockfile

# Salin semua source code
COPY . .

# Ambil argumen dari docker-compose
ARG VITE_BACKEND_URL
# Set environment agar Vite bisa baca saat build
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

# Build aplikasi
RUN echo "Building app with VITE_BACKEND_URL=${VITE_BACKEND_URL}" && pnpm build

# Stage 2: Jalankan hasil build dengan Nginx
FROM nginx:1.27-alpine

# Salin hasil build dari stage builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Salin konfigurasi nginx custom (opsional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Jalankan nginx
CMD ["nginx", "-g", "daemon off;"]
