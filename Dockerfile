FROM node:14-alpine

WORKDIR /app

RUN npm install -g nodemon

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3030

CMD [ "npm", "run", "dev"]