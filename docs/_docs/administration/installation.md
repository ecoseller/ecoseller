---
title: Installation
category: Administration documentation
order: 1
---

## Prerequisites
Before proceeding with the installation of **ecoseller**, it is important to ensure that your machine meets the necessary prerequisites. While **ecoseller** itself is not demanding and can run on less powerful devices, it is recommended to have a slightly more capable setup for the default installation, especially when including the Elasticsearch and AI recommendation system.

To run **ecoseller** with the AI recommendation system and Elasticsearch, we recommend using a machine with the following specifications:

* CPU: 8 cores or more
* RAM: 8GB or more
* Free Space: 10GB

It's worth noting that Elasticsearch itself requires a significant amount of memory to run efficiently, ideally around 4GB. Therefore, the suggested 8GB RAM allocation ensures smooth operation of both **ecoseller** and Elasticsearch.

However, if you are running **ecoseller** without the Elasticsearch and AI recommendation system or with a smaller dataset, you can use less powerful devices as well.

Based on our testing, we have observed that for a typical scenario with 2100 product variants and several thousand events, the training process for Level 3 recommendations requires a maximum of 1GB of RAM and completes within approximately 2 seconds. For Level 2 recommendations, the memory consumption is around 130MB, and the training process takes approximately 92 seconds.

By considering these prerequisites and performance benchmarks, you can ensure optimal performance and resource allocation for **ecoseller** and its AI recommendation system.

Since **ecoseller** is fully containerized, make sure your system is Docker-ready before proceeding with the installation. If you are new to Docker, you can refer to the official [Docker documentation](https://docs.docker.com/get-docker/) for detailed instructions on installing Docker on your machine.

Also you **should have some experience** with [Docker Compose](https://docs.docker.com/get-docker/), [Django](https://docs.djangoproject.com/en/4.2/), [Python](https://www.python.org/doc/) and[ Next.js (React)](https://nextjs.org/docs). If not - you can learn it from the official documentations. If you don't have time for that - you can hire us to do it for you (the way it was meant to without compromises). 😉


# Running **ecoseller**
**ecoseller** can be deployed in different environments depending on your needs, whether it's for development, production, or a demo environment. This section will guide you through the steps to run Ecoseller in each of these environments.

The starting point, however, is the same for all environments. You need to clone the **ecoseller** repository from the source code repository and navigate to the project directory in your terminal.

```bash
git clone https://github.com/ecoseller/ecoseller.git
```

## Development environment
To run **ecoseller** in a development environment, follow these steps:

* Ensure you have Docker and Docker Compose installed on your system.
* Clone the Ecoseller repository from the source code repository.
* Navigate to the project directory in your terminal.
* Create `src/backend/docker-compose.env` from [example](#env-backend). Please make sure `DEBUG` flag is set to `1` and `DJANGO_ALLOWED_HOSTS` is set to `"*"` in this file.
* Create `src/recommender_system/docker-compose.env` from [example](#env-backend).
* Run the following command to start **ecoseller** in development mode: 
  `docker compose up`. 
  
  This command will start all the containers and services required for **ecoseller** to run. 
  All the containers will be started in the foreground, and you will be able to see the logs from each container in your terminal.
  Please note that the first time you run this command, it will take some time to download the required images and build the containers.

  Also note that both storefront and dashboard are quite slow in the developement mode since they are running in the debug mode and Next.js rebuilds every single page on every single request. 

## Production environment

## Demo environment
The demo environment in Ecoseller is designed to showcase the platform's features and functionality using preloaded demo products (1400+), variants (2200+), and additional data. Setting up the demo environment is similar to the production environment, with the main difference being the utilization of the docker-compose.demo.yml file. 

**Also, please note, that the demo environment is not intended for production use. It's not setup for persistent storage so after you stop the containers all the data will be lost.**


### With proxy

### Without proxy 

# Environment variables 
**ecoseller** utilizes environment variables to configure various aspects of the backend and recommendation system. These environment variables are stored in separate files, namely `docker-compose.env`. For the backend it's `src/backend/docker-compose.env` and `src/recommender_system/docker-compose.env` for recommendation system. Additionally, the storefront, dashboard, and other services have their environment variables directly specified in the  YAML file for specific docker compose.

## Backend <span id="env-backend"><span>
This is an example of `src/backend/docker-compose.env` file. You can use it as a template for your own configuration.
Please note that in this file you can configure Django backend and all the connections to other services that are used by the backend.

### Example

```env
DEBUG=1
DJANGO_ALLOWED_HOSTS="*"

DATABASE=postgres
DB_ENGINE=django.db.backends.postgresql_psycopg2
POSTGRES_DB=db
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_HOST=postgres_backend
POSTGRES_PORT=5432

USING_REDIS_QUEUE=1
REDIS_QUEUE_LOCATION=redis

PYTHONUNBUFFERED=1

RS_URL="http://recommender_system:8086"
STOREFRONT_URL="https://www.example.com"

NOTIFICATIONS_CONFIG_PATH="./config/notifications.json"

EMAIL_USE_SSL=1
EMAIL_PORT=465
EMAIL_HOST=smtp.example.com
EMAIL_HOST_USER=ecoseller@example.com
EMAIL_HOST_PASSWORD="yourpassword
EMAIL_FROM=Storefront<ecoseller@example.com>

USE_ELASTIC=1
ELASTIC_HOST="elasticsearch:9200"
ELASTIC_AUTO_REBUILD_INDEX=0
```

## Recommendation system <span id="env-rs"><span>

# Reserved ports

