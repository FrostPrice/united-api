FROM node:latest

WORKDIR /united-api

COPY . .

RUN npm install

CMD [ "node", "./index.js" ]