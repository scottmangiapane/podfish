# syntax=docker/dockerfile:1

################################
# Build stage                  #
################################

FROM node as build

WORKDIR /app
COPY package*.json ./
RUN npm i

COPY . .

RUN npm run build

################################
# Dev stage                    #
################################

FROM build as dev

WORKDIR /app

EXPOSE ${UI_PORT}

ENTRYPOINT [ "npm", "run", "dev" ]

################################
# Prod stage                   #
################################

FROM nginx as prod

COPY nginx.conf /etc/nginx/templates/podfish.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE ${UI_PORT}
