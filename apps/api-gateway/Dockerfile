FROM node:lts-alpine as build
WORKDIR /usr/local/tekana-api-gateway
COPY . .
RUN apk add --no-cache git
RUN apk -U --no-cache add protobuf protobuf-dev
RUN npm run proto:install
RUN npm install
COPY . .
RUN npm run prebuild
RUN npm run build
EXPOSE 3000
CMD [ "npm", "start" ]