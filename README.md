# express
**Node.js express Toy project**

성능, 보안, CI/CD, TDD에 대한 내용 정리

[![Build Status](https://github.com/ghwany/express/workflows/build/badge.svg)](https://github.com/ghwany/express/actions?query=workflow%3Abuild)
[![Lint Status](https://github.com/ghwany/express/workflows/lint/badge.svg)](https://github.com/ghwany/express/actions?query=workflow%3Alint)
![version](https://img.shields.io/github/package-json/v/ghwany/express?color=yellow) 

<br>

# Dependents

### ![Lint Status](https://img.shields.io/github/package-json/dependency-version/ghwany/express/express) ![Typescript](https://img.shields.io/github/package-json/dependency-version/ghwany/express/dev/typescript) Language

### ![TypeDI](https://img.shields.io/github/package-json/dependency-version/ghwany/express/typedi) ![TypeORM](https://img.shields.io/github/package-json/dependency-version/ghwany/express/typeorm) ![MVC](https://img.shields.io/github/package-json/dependency-version/ghwany/express/routing-controllers) ORM, MVC 

### ![Mocha](https://img.shields.io/github/package-json/dependency-version/ghwany/express/dev/mocha) ![chai](https://img.shields.io/github/package-json/dependency-version/ghwany/express/dev/chai) ![supertest](https://img.shields.io/github/package-json/dependency-version/ghwany/express/dev/supertest) TDD

### ![PM2](https://img.shields.io/github/package-json/dependency-version/ghwany/express/pm2) Cluster, Process Monitoring

### ![winston](https://img.shields.io/github/package-json/dependency-version/ghwany/express/winston) Logger

### ![docker](https://img.shields.io/badge/-docker-blue) ![github action](https://img.shields.io/badge/-Github--Action-blue) CI/CD 

### ![eslint](https://img.shields.io/github/package-json/dependency-version/ghwany/express/dev/eslint) ![prettier](https://img.shields.io/github/package-json/dependency-version/ghwany/express/dev/prettier) Lint 

<br>

# 준비하기
1.  SSL 인증서 ```fullchain.pem```, ```private.pem``` 파일을 ```./docker/nginx/ssl/``` 경로에 준비
2.  ```./src/config/``` 경로에 NODE_ENV 환경에 맞는 .env파일을 준비
```conf
# NODE_ENV=production >> production.env
# APPILCATION
PORT=3000
PREFIX=API

# DATABASE
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3010
DATABASE_USER=user
DATABASE_PASSWORD=...
DATABASE_NAME=dbname

# JWT
JWT_SECRET=secretkey
```

# 시작하기
```docker
docker-compose up -d
```
