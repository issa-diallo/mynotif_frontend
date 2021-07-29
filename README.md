# MyNotif Frontend

[![Tests](https://github.com/issa-diallo/MyNotif_frontend/workflows/Tests/badge.svg?branch=develop)](https://github.com/issa-diallo/MyNotif_frontend/actions?query=workflow%3ATests)

Frontend for MyNotif: Patient management app for nurses.
https://mynotif.herokuapp.com/

Backend is available via:
<https://github.com/issa-diallo/Mynotif_backend>

## Install
```sh
yarn install
```

## Run
```sh
yarn dev
```

## Test
```sh
yarn test
yarn lint
```

## Docker
Build:
```sh
docker build --tag issa-diallo/mynotif-frontend .
```
Run:
```sh
docker run --rm -it --publish 3000:80 issa-diallo/mynotif-frontend
```

## Deploy to Heroku
```sh
git push heroku main
```
Or if you want to deploy `develop`:
```sh
git push heroku develop:main
```
