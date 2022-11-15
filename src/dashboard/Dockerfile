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

RUN npm run build 

# runner
FROM builder as runner
WORKDIR /usr/src/app
# ENV NODE_ENV production
ENV NODE_ENV development



# CMD ["npm", "start"]
CMD ["npm", "run", "dev"]