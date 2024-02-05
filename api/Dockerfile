# syntax=docker/dockerfile:1

FROM golang

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

EXPOSE ${API_PORT}

ENTRYPOINT ./run.sh
