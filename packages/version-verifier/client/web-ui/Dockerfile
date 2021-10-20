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
RUN npm install -g lerna

COPY ./lerna.json ./
COPY ./package.json ./package.json
COPY ./tsconfig.json ./tsconfig.json
COPY ./.eslintrc ./.eslintrc
COPY ./.eslintignore ./.eslintignore
COPY ./yarn.lock ./yarn.lock
COPY ./packages/version-verifier/client/web-ui ./packages/web-ui

RUN lerna bootstrap
RUN lerna run build

EXPOSE ${WEB_UI_PORT}

ENTRYPOINT ["serve", "-s", "packages/web-ui/build"]