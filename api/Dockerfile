# syntax=docker/dockerfile:1

FROM golang:1.21

ENV CGO_ENABLED=0 \
    GOOS=linux

WORKDIR /podfish-src

RUN go install github.com/githubnemo/CompileDaemon@latest && \
    go install github.com/swaggo/swag/cmd/swag@latest

COPY go.mod go.sum ./
RUN go mod download && \
    go mod verify

COPY . .

EXPOSE 8080

ENTRYPOINT CompileDaemon \
    -build="swag init && go build -o /podfish" \
    -command="/podfish" \
    -exclude-dir="./docs"
