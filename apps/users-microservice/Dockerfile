FROM node:14-alpine
WORKDIR /usr/local/takana-ewallet/users-service
COPY package*.json ./
RUN apk add --no-cache git
RUN apk -U --no-cache add protobuf protobuf-dev
RUN npm run proto:user
RUN npm install

# Bundle app source
COPY . .

# Compile TypeScript source
RUN npm run prebuild
RUN npm run build

EXPOSE 50051
CMD ["npm", "start"]