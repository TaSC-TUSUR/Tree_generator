# ---------- Stage 1: Build ----------
FROM node:20-alpine AS build
WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm ci

# Copy all project files
COPY . .

# Build for production
RUN npm run build

# ---------- Stage 2: Serve ----------
FROM nginx:stable-alpine

# Copy built app from dist/ (Vite output folder)
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 (Nginx default)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
