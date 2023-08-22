---
title: Deployment
category: Programming documentation
order: 6
---

Table of contents:
* TOC
{:toc}

Ecoseller offers deployment using Docker and Docker Compose, providing a consistent and reproducible environment across different deployment scenarios. This section of the programming documentation outlines parts and logic behind included Docker Compose files: `docker-compose.yml`, `docker-compose.demo.yml`, and `docker-compose.prod.yml`.

## Docker Compose files
Docker Compose is a powerful tool that allows you to define and manage multi-container Docker applications. It simplifies the process of deploying and running complex applications by defining the services, networks, and volumes required for your application in a single YAML file. With Docker Compose, you can easily orchestrate the deployment of your application stack, specify environment variables, and configure inter-container communication.
If you are not familiar with Docker Compose, we recommend you to read the [official documentation](https://docs.docker.com/compose/).

All our docker-compose files define the same services (except for `docker-compose.yaml` - it doesn't contain Nginx reverse proxy), but with different configurations. The services are:
* `backend` - Core backend service, written in Python using Django framework. It can be accessed via port 8000 and has three targets - `development`, `demo`, and `production`.
* `postgres_backend` - PostgreSQL database for backend service. It can be accessed via port 5433.
* `redis` - Redis database for backend service. It can be accessed via port 6379.
* `rq-worker` - RQ worker for backend service. It picks up tasks from Redis database and executes them. It's basicaly a copy of `backend` service, but with different command ran on startup.
* `elasticsearch` - ElasticSearch database for backend service. It can be accessed via port 9200.
* `frontend_dashboard` - Dashboard service written in Next.js. It can be accessed via port 3030. It has two targets - `development` and `production`. The `developemnt` target is used for local development (`npm run dev`), while `production` target runs the service in production mode (`npm run build && npm run start`).
* `frontned_storefront` - Dashboard service written in Next.js. It can be accessed via port 3031. It has two targets - `development` and `production`. The `developemnt` target is used for local development (`npm run dev`), while `production` target runs the service in production mode (`npm run build && npm run start`).
* `postgres_rs` - PostgreSQL database for recommender system. It can be accessed via port 5434.
* `recommender_system` - Recommender system service written in Python using Flask framework. It can be accessed via port 8001 and has two targets - `development` and `production`.
* `recommender_system_trainer` - Short term living service that trains recommender system. It's basicaly a copy of `recommender_system` service, but with different command ran on startup.

## Dockerfile
Dockerfile is a text document that contains all the commands a user could call on the command line to assemble an image. Using `docker build` users can create an automated build that executes several command-line instructions in succession. This page describes the commands you can use in a Dockerfile. For the full reference on Dockerfile, we recommend you to read the [official documentation](https://docs.docker.com/engine/reference/builder/).

Here are some interesting parts of our Dockerfile that are worth mentioning.

### Multi-stage builds
Multi-stage builds are a new feature requiring Docker 17.05 or higher on the daemon and client. Multistage builds are useful to anyone who has struggled to optimize Dockerfiles while keeping them easy to read and maintain. They allow you to go from a Dockerfile that has multiple `FROM` instructions to a single `FROM` instruction. You can read more about multi-stage builds in the [official documentation](https://docs.docker.com/develop/develop-images/multistage-build/).
We used this feature on both frontend services, `frontend_dashboard` and `frontend_storefront` and `backend` service. Here is an example of `frontend_dashboard` Dockerfile:
```dockerfile
# dependencies
FROM node:18-alpine3.14 as dependencies
WORKDIR /usr/src/app
COPY ./package.json .
COPY ./package-lock.json .

RUN npm install -g npm@8.8.0
RUN npm install --legacy-peer-deps

# builder
FROM dependencies as builder
WORKDIR /usr/src/app
COPY . .

# development environment
FROM builder as development
WORKDIR /usr/src/app
ENV NODE_ENV development
CMD ["npm", "run", "dev"]

# production environment
FROM builder as production
WORKDIR /usr/src/app
ENV NODE_ENV production
RUN npm run build
CMD ["npm", "start"]

# demo environment
FROM builder as demo
WORKDIR /usr/src/app
ENV NODE_ENV production
RUN npm run build
CMD ["npm", "start"]
```
As you can see from the example, we have five stages in this Dockerfile:
* `dependencies` - This stage installs all dependencies for the project. It's used in all other stages.
* `builder` - This stage copies all files from the project to the image. It's used in all other stages.
* `production`/`demo` - This stage builds the project and runs it in production mode.
* `development` - This stage runs the project in development mode.

This way, we can have a single Dockerfile for all three environments, and we can easily switch between them by changing the target in `docker-compose.yml` file. For example, if we want to run `frontend_dashboard` in development mode, we would use the following command:
```bash
docker compose -f docker-compose.yml up frontend_dashboard
```
If we want to run it in production mode, we would use the following command:
```bash
docker compose -f docker-compose.prod.yml up frontend_dashboard
```

The same logic applies to `backend` service. Here is an example of `backend` Dockerfile:
```dockerfile
FROM python:3.9-slim as base

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

RUN apt-get update
RUN apt-get install -y gcc

COPY ./requirements.txt requirements.txt

RUN pip3 install -U setuptools 
RUN pip3 install -r ./requirements.txt

COPY ./core/ .

# Development branch of a Dockerfile
FROM base as development
RUN chmod +x /usr/src/app/entrypoint.sh
ENTRYPOINT [ "sh", "/usr/src/app/entrypoint.sh" ]

# Demo branch of a Dockerfile
FROM base as demo
RUN apt-get install -y git postgresql-client
RUN chmod +x /usr/src/app/entrypoint.sh
# load demo data
ENTRYPOINT [ "sh", "-c", "/usr/src/app/entrypoint_demo.sh && /usr/src/app/entrypoint.sh" ]

# Production branch of a Dockerfile
FROM base as production
RUN chmod +x /usr/src/app/entrypoint.sh
ENTRYPOINT [ "sh", "/usr/src/app/entrypoint.sh" ]
```
As you can see from the example, we have four stages in this Dockerfile:
* `base` - This stage installs all dependencies for the project. It's used in all other stages.
* `development` - This stage runs the project in development mode using typical `python3 manage.py runserver` command.
* `demo` - This stage runs the project in production mode. It also loads demo data into the database. Production mode is ran using `gunicorn` server as `gunicorn core.wsgi -c ./gunicorn/conf.py`.
* `production` - This stage runs the project in production mode. Production mode is ran using `gunicorn` server as `gunicorn core.wsgi -c ./gunicorn/conf.py`. 

#### Gunicon
The basic settings for Gunicorn are defined in the `backend/core/gunicorn/conf.py` file. Here is an example of `gunicorn/conf.py` file:
```python
import multiprocessing
# gunicorn.conf.py
# Non logging stuff
bind = "0.0.0.0:8000"
workers = multiprocessing.cpu_count() * 2 + 1
threads = 2
# Access log - records incoming HTTP requests
accesslog = "/var/log/gunicorn.access.log"
# Error log - records Gunicorn server goings-on
errorlog = "/var/log/gunicorn.error.log"
# Whether to send Django output to the error log
capture_output = True
# How verbose the Gunicorn error logs should be
loglevel = "info"
```

All logs are stored in `/var/log` directory. This directory is not mounted to the host machine, so you can't access it directly. However, you can access it using `docker exec` command. For example, if you want to see the content of `gunicorn.access.log` file, you would use the following command:
```bash
docker exec -it backend cat /var/log/gunicorn.access.log
```

### Docker cache
Docker can cache the results of each build step. This is useful when you are building an image that is based on another image. If the previous build step has not changed, Docker will reuse the cache and skip the build step. This can significantly speed up the build process. However, if you are not careful, this can lead to unexpected results. For example, if you change the order of the build steps, Docker will not reuse the cache. This can lead to unexpected results.

