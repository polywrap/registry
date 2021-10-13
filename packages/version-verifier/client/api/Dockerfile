FROM node:10.15.3-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./ ./

RUN apk --no-cache --virtual build-dependencies add \
    bash \
    git \
    openssh \
    python \
    make \
    g++ 
RUN npm i -g typescript 
RUN yarn \
    && yarn build

EXPOSE ${API_PORT}

ENTRYPOINT yarn start:docker
