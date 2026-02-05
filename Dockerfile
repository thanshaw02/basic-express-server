FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port 8080 (Azure App Service default for Node.js)
EXPOSE 8080

# Set environment variable for port
ENV PORT=8080

# Start the application
CMD ["node", "app.js"]
