# Use official Node.js image
FROM node:14-alpine

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package.json ./
RUN npm install

# Copy the source code
COPY . .

# Expose the API port
EXPOSE 5000

# Run the app
CMD ["npm", "start"]

