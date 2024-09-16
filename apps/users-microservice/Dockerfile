FROM node:lts-alpine
WORKDIR /usr/local/takana-user-service
COPY . .
RUN apk add --no-cache git
RUN apk -U --no-cache add protobuf protobuf-dev
RUN npm install
RUN npm run proto:users


# Bundle app source
COPY . .

# Compile TypeScript source
RUN npm run build
EXPOSE 50051
CMD ["npm", "start"]