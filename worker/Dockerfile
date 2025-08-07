# syntax=docker/dockerfile:1

################################
# Build stage                  #
################################

FROM golang as build

ENV CGO_ENABLED=0 \
    GOOS=linux

RUN go install github.com/githubnemo/CompileDaemon@latest

# Installing dependencies early reduces future build times due to layer caching.
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download && \
    go mod verify

COPY . .

WORKDIR /app/worker
RUN go build -o /podfish-worker

################################
# Dev stage                    #
################################

FROM build as dev

WORKDIR /app/worker

# If docker-compose with volume mounting is used on macOS before the `docs` folder exists,
# CompileDaemon enters an infinite loop. `-polling=true` fixes it.
ENTRYPOINT CompileDaemon \
    -build="go build -o /podfish-worker" \
    -command="/podfish-worker" \
    -directory="." \
    -directory="../shared" \
    -polling=true

################################
# Prod stage                   #
################################

FROM alpine as prod

COPY --from=build /podfish-worker /podfish-worker

ENTRYPOINT [ "/podfish-worker" ]
