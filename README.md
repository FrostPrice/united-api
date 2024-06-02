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

## Generate a Secret Key

To generate a secret key, you can use the following command:

```bash
node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"
```

or a linux command:

```bash
head -c16 /dev/urandom > secret.key
```

## Entities

- **User**: Represents the users of the system, who can be students. Each user can have multiple notifications, events, and enrollments.
- **Notification**: Represents notifications associated with a user.
- **Event**: Represents events associated with a user.
- **Session**: Manages user login sessions.
- **Professor**: Represents professors who teach courses and subjects.
- **Course**: Represents the offered courses and is associated with a professor.
- **Subject**: Represents the subjects that are part of a course and are taught by a professor.
- **Content**: Represents the content of a subject.
- **Assessment**: Represents the evaluations of a subject.
- **Grade**: Represents the grades assigned to an assessment for an enrollment.
- **Enrollment**: Represents the enrollment (Matricula) of a user in a subject.
