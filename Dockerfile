FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm install --production

# Copy source code and config
COPY src ./src
COPY config ./config

ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001

CMD ["node", "src/main.js"]
