# Stage 1: Build React App
FROM node:14-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to leverage Docker caching
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy the rest of the source code
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve with Nginx (smaller and faster)
FROM nginx:alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Copy built React files from previous stage
COPY --from=builder /usr/src/app/build .

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
