# syntax=docker/dockerfile:1

FROM node

WORKDIR /podfish-src

COPY package*.json ./
RUN npm i

COPY . .

EXPOSE ${UI_PORT}

CMD ["npm", "run", "dev"]
