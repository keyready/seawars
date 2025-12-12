FROM node:20-alpine AS base

RUN apk add --no-cache dumb-init

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production && \
    npm cache clean --force

FROM node:20-alpine

USER node

WORKDIR /app

COPY --from=base --chown=node:node /app/node_modules ./node_modules

COPY --chown=node:node . .

EXPOSE 5000

CMD ["node", "server.js"]