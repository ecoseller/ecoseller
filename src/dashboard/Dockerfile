# dependencies
FROM node:18-alpine3.14 as dependencies
WORKDIR /usr/src/app
COPY ./package.json .
COPY ./package-lock.json .

RUN npm install -g npm@8.8.0
RUN npm install --legacy-peer-deps

# builder
FROM dependencies as builder
WORKDIR /usr/src/app
COPY . .

# development environment
FROM builder as development
WORKDIR /usr/src/app
ENV NODE_ENV development
CMD ["npm", "run", "dev"]

# production environment
FROM builder as production
WORKDIR /usr/src/app
ENV NODE_ENV production
RUN npm run build
CMD ["npm", "start"]