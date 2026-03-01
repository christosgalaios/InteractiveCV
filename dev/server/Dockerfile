FROM node:20-alpine

WORKDIR /app

# Copy server package files
COPY server/package.json server/package-lock.json* ./server/

# Install server dependencies
WORKDIR /app/server
RUN npm install --production

# Copy all project files
WORKDIR /app
COPY . .

# Expose port
EXPOSE 3000

# Start server
WORKDIR /app/server
CMD ["node", "index.js"]
