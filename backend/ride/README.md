## Ride

Ride backend service.

## Setup postgres

Create postgres database instance on docker:

```
docker run \
    --name postgres-db \
    -h 127.0.0.1 \
    -p 5432:5432 \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=123456 \
    -e POSTGRES_DB=app \
    -d \
    postgres:15.4-alpine
```

Execute create table script:

```
PGPASSWORD=123456 psql -h localhost -p 5432 -U postgres  -d app -f create.sql
```

## Run locally

To run backend/ride service locally, follow steps below:

1. Install dependencies

```
yarn install
```

2. Run application

```
yarn dev
```
