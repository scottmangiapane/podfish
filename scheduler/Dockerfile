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

WORKDIR /app/scheduler
RUN go build -o /podfish-scheduler

################################
# Dev stage                    #
################################

FROM build as dev

WORKDIR /app/scheduler

# If docker-compose with volume mounting is used on macOS before the `docs` folder exists,
# CompileDaemon enters an infinite loop. `-polling=true` fixes it.
ENTRYPOINT CompileDaemon \
    -build="pwd && ls && go build -o /podfish-scheduler" \
    -command="/podfish-scheduler" \
    -directory="." \
    -directory="../shared" \
    -polling=true

################################
# Prod stage                   #
################################

FROM alpine as prod

COPY --from=build /podfish-scheduler /podfish-scheduler

ENTRYPOINT [ "/podfish-scheduler" ]
