FROM node:14.16.0-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN apk --no-cache --virtual build-dependencies add \
    bash \
    git \
    openssh \
    python \
    make \
    g++
RUN npm install -g serve

COPY ./ ./

RUN yarn install 
RUN yarn build

EXPOSE ${WEB_UI_PORT}

ENTRYPOINT ["serve", "-s", "build"]
