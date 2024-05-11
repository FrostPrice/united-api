# United API

This repository contains all the code related to the BackEnd (API) application of the United College ERP.

## Requirements

- Node.js
- PostgreSQL (Either Docker, a Local Installation or a Cloud Server)
- Docker and docker-compose (Optional)

## How to run

1. Clone the repository
2. Run `npm install`
3. Start the PostgreSQL server (Depends on the installation method)
4. Configure the `.env` file. The `.env.sample` file is a template for the configuration.
5. Run `npm run dev`
6. Have fun :)

## Running Postgresql with Docker

1. Clone the repository
2. Run `docker compose up` (It will be necessary to comment the service `united-api` in the `docker-compose.yml` file)
3. The PostgreSQL server will start

## How to with Docker

1. Clone the repository
2. Configure the `.env` file. The `.env.sample` file is a template for the configuration.
3. Run `docker build -t united-api .` (This will generate the Docker image)
4. Run `docker compose up` (This will also start the PostgreSQL server)
5. Have fun :)

PS: It will create a folder called `data` in the root of the project. This folder will store the data of the PostgreSQL server. DO NOT SEND IT TO GITHUB!
