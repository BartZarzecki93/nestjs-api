<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Description

Bootcamp API (Swagger - Graphql - Mongo - JWT Strategy)

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API

```bash
npm run start:dev

http://localhost:5000/api
```

## GraphQl

```bash
npm run start:dev

http://localhost:5000/graphql
```

## Docker

```bash
To run docker:
docker-compose up -d

Run in CLI:

curl --location --request POST '0.0.0.0:3000/auth/register' --header 'Content-type: application/json' --data-raw '{"email": "bart@o2.pl", "password": "Swimzarzec12$", "role": "user"}'

To stop docker:
docker-compose down

```
