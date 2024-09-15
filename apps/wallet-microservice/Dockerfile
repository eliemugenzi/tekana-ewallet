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
ENV DOCKERIZE_VERSION v0.8.0
RUN apk add --update  wget \
    && wget -O - https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz | tar xzf - -C /usr/local/bin \
    && rm -rf /var/lib/apt/lists/*
COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh
RUN npx prisma generate
RUN npx prisma migrate deploy


EXPOSE 50053

CMD ["npm", "start"]


