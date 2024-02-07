# syntax=docker/dockerfile:1

################################
# Build stage                  #
################################

FROM node as build

WORKDIR /podfish-src

COPY package*.json ./
RUN npm i

COPY . .

RUN npm run build

################################
# Dev stage                    #
################################

FROM build as dev

WORKDIR /podfish-src

EXPOSE ${UI_PORT}

ENTRYPOINT [ "npm", "run", "dev" ]

################################
# Prod stage                   #
################################

FROM nginx as prod

COPY nginx.conf /etc/nginx/templates/podfish.conf.template
COPY --from=build /podfish-src/dist /usr/share/nginx/html

EXPOSE ${UI_PORT}
