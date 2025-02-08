FROM node:latest

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY /dist /app/

EXPOSE 5000

CMD [ "node", "index.js" ]