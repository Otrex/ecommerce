FROM node:14-alpine

COPY package.json ./app
RUN npm install

WORKDIR /app
COPY . /app

ENV NODE_ENV=production
ENV PORT=80

EXPOSE 80

CMD ["node", "./src/server.js"]