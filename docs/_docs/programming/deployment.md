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

All our docker-compose files define the same services (except for `docker-compose.demo.yml` and `docker-compose.prod.yml` - they contain Nginx reverse proxy), but with different configurations. The services are:
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