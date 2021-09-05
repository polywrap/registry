FROM node:14.17.6-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./ ./

RUN apk --no-cache --virtual build-dependencies add \
  bash \
  git \
  openssh \
  python \
  make \
  g++ \
  && yarn \
  && yarn build

ENTRYPOINT yarn start run
