# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone {repository URL}
```
## Run with docker
* `Docker` and `docker-compose` are needed for running the app. Here are the instructions:S

https://docs.docker.com/engine/installation/#platform-support-matrix

https://docs.docker.com/engine/installation/linux/linux-postinstall/

https://docs.docker.com/compose/install/

To run app make the next steps:
```
docker-compose up -d
```

## Installing NPM modules

```
npm install
```

## Running application

```
npm start
```

## Developing
```
npm start:dev
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```
