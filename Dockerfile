# ---------- Stage 1: Build ----------
FROM node:20 AS build

# Set the working directory inside the container
WORKDIR /app

# Install all dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the project and build the application
COPY . .
RUN npm run build

# ---------- Stage 2: Runtime ----------
FROM node:20-slim

WORKDIR /app
ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the compiled output from the build stage
COPY --from=build /app/dist/pharma-trace ./dist/pharma-trace

EXPOSE 4000
CMD ["node", "dist/pharma-trace/server/server.mjs"]
