# syntax=docker/dockerfile:1

FROM golang:1.21

WORKDIR /src

RUN go install github.com/swaggo/swag/cmd/swag@latest

COPY go.mod go.sum ./
RUN go mod download && \
    go mod verify

COPY . .
RUN swag init && \
    CGO_ENABLED=0 GOOS=linux go build -o /podcast-api

EXPOSE 8080

CMD ["/podcast-api"]
