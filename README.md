# United API

The repository containing the API related to the United College ERP.

## Require

- [Rust Stable](https://rustup.rs)
- [Postgres](https://www.postgresql.org/)

Or using **[Docker](https://www.docker.com/) (Recomended)**

## How to run

### Starting dev environment

- There are 2 ways that this can be achieved:
  - Using `cargo build` and `cargo run` in sequence
  - **(Recomended)** using `cargo watch` to enable live reload of the API and on development testing. Run the following: `cargo watch -q -c -w src/ -x run` for just the live-reload or `cargo watch -q -c -w src/ -x check -x test -x run` to enable testing too

### Compiling locally (Linux only)

- Initiate the PostgresDB, it can be either on a Cloud, [Docker](https://hub.docker.com/_/postgres) or directly on the host machine
- Access the `src` folder and create your own secret key by running `head -c16 /dev/urandom > secret.key`
- Adapt the values of the .env file to fit your infraestrutucture
- Build the release version: `cargo build --release`
- Run the binary in the terminal with `target/release/rust-act;ix-web-template`
- Rewrite the universe in Rust !!

### Compiling with Docker (Linux only)

- Access the project folder -.-
- Execute the `build_container.sh` and inform a version for the image to create the it
- Run the container
- Rethink why you didn't used Docker before

## Environment Variables

- `APP_HOST`: The host ip or dns that the API will be listening to
- `APP_PORT`: The port that the API will be listening to
- `DATABASE_URL`: The URL of the Postgres Database
- `DEFAULT_USERNAME`: The default username for the API
- `DEFAULT_PASSWORD`: The default password for the API
- `DEFAULT_EMAIL`: The default email for the API

## For more in depth debugging

When debugging the docker images, it is useful to use the following commands:

```bash
strace ./rust-actix-web-template
ldd ./rust-actix-web-template
```
