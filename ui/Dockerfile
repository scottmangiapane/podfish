# syntax=docker/dockerfile:1

FROM node

WORKDIR /podfish-src

COPY package*.json ./
RUN npm i

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
