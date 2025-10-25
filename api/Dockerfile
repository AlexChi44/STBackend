FROM node:alpine AS builder

WORKDIR /app

COPY package* ./

RUN npm ci --only=production && npm cache clean --force

COPY . ./

RUN npm run build

# Production stage
FROM node:alpine

WORKDIR /app

EXPOSE 5555

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

CMD [ "npm", "start" ]