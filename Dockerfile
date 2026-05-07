FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm install --production

# Copy source code (includes src/config)
COPY src ./src

ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001

# Entry point is src/main.js
CMD ["node", "src/main.js"]
