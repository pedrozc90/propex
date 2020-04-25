# base image
FROM node:12.14-alpine AS builder

# extra data
LABEL author="pedrozc90"
LABEL version="1.0.0"
LABEL description="express server powered by Ts.ED framework"

# create application directory
WORKDIR /usr/src/app

# install app dependencies
# a wildcard is used to ensure both package.json AND package-lock.json are copied
# COPY package*.json ./
COPY package.json ./

# If you are building your code for production
# RUN npm ci --only=production
# RUN npm ci

# install packages
RUN npm install

# bundle source code (.dockerignore will take care of unwanted files)
COPY . .

# transpile typescript into javascript
RUN npm run build

# environment variables
ENV NODE_ENV=production
ENV PORT=9000

EXPOSE 9000

CMD [ "node", "dist/index.js" ]
