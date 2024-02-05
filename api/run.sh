#!/bin/sh

if [ "$PRODUCTION" = "true" || "$PRODUCTION" = "TRUE" ]
then

swag init
go build -o /podfish
/podfish

else

# If docker-compose with volume mounting is used on macOS before the `docs` folder exists,
# CompileDaemon enters an infinite loop. `-polling=true` fixes it.
CompileDaemon \
    -build="swag init && go build -o /podfish" \
    -command="/podfish" \
    -exclude-dir="./docs" \
    -polling=true

fi
