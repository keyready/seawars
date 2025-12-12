FROM node:20-alpine AS build

WORKDIR /client

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "build"]