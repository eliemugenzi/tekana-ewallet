FROM node:lts-alpine as build

WORKDIR /usr/local/takana-wallets-service

COPY . .

RUN apk add --no-cache git

RUN apk -U --no-cache add protobuf protobuf-dev

RUN npm run proto:install

RUN npm install
RUN npm run proto:wallets
RUN npm run proto:transactions
# RUN npx prisma migrate deploy
# RUN npx prisma generate

# Bundle app source
COPY . .

# Compile TypeScript source
RUN npm run prebuild
RUN npm run build



EXPOSE 50053

CMD ["npm", "start"]


