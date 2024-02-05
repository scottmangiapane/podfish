#!/bin/sh

if [ "$PRODUCTION" = "true" || "$PRODUCTION" = "TRUE" ]
then

npx vite build
# TODO how to serve? New nginx container?

else

npm run dev

fi
