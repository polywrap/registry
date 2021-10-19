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
RUN npm i -g typescript 
RUN npm i -g lerna

COPY ./lerna.json ./
COPY ./package.json ./package.json
COPY ./tsconfig.json ./tsconfig.json
COPY ./yarn.lock ./yarn.lock
COPY ./packages/version-verifier/client/api ./packages/api
COPY ./packages/version-verifier/js ./packages/js
COPY ./packages/version-verifier/node ./packages/node
COPY ./packages/registry-core-js ./packages/registry-core-js
COPY ./packages/registry-js ./packages/registry-js
COPY ./packages/registry ./packages/registry
COPY ./packages/registry-test-utils ./packages/registry-test-utils

RUN lerna bootstrap
RUN lerna run build

EXPOSE ${API_PORT}

ENTRYPOINT ["yarn", "--cwd=./packages/api", "start:docker"]
