# syntax=docker/dockerfile:1

################################
# Build stage                  #
################################

FROM golang as build

ENV CGO_ENABLED=0 \
    GOOS=linux

WORKDIR /podfish-src

RUN go install github.com/githubnemo/CompileDaemon@latest && \
    go install github.com/swaggo/swag/cmd/swag@latest

# Installing dependencies early reduces future build times due to layer caching.
COPY go.mod go.sum ./
RUN go mod download && \
    go mod verify

COPY . .

RUN swag init && go build -o /podfish

################################
# Dev stage                    #
################################

FROM build as dev

WORKDIR /podfish-src

EXPOSE ${API_PORT}

# If docker-compose with volume mounting is used on macOS before the `docs` folder exists,
# CompileDaemon enters an infinite loop. `-polling=true` fixes it.
ENTRYPOINT CompileDaemon \
    -build="swag init && go build -o /podfish" \
    -command="/podfish" \
    -exclude-dir="./docs" \
    -polling=true

################################
# Prod stage                   #
################################

FROM alpine as prod

COPY --from=build /podfish /podfish

EXPOSE ${API_PORT}

ENTRYPOINT [ "/podfish" ]
