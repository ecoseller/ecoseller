---
title: Installation
category: Administration documentation
order: 1
---

Table of contents:
* TOC
{:toc}

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
![Docker services](../../images/admin/docker.png)

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
In a production environment, Ecoseller utilizes a combination of Gunicorn for both Flask Recommender and Django backend, and Nginx to ensure a robust and efficient deployment. The production build mode of Next.js is used to run the storefront and dashboard services. Additionally, Nginx is configured as a reverse proxy to efficiently handle incoming requests and distribute them to the appropriate services.

### Reverse proxy
Nginx is used as a reverse proxy to efficiently handle incoming requests and distribute them to the appropriate services.
It acts as a middle layer between the client and the backend services, enhancing performance and enabling load balancing.
Two configurations are supplied for the Nginx reverse proxy:
- Simple Port Mapping: In this configuration, Nginx maps incoming requests directly to the appropriate backend service based on port numbers.
- - Please see `/src/reverse_proxy/nginx.conf`
- Server Name Based Routing: This configuration allows Nginx to utilize different server names to route requests to the corresponding backend services.
- - - Please see `/src/reverse_proxy/nginx.example.conf`
If you wish to use the Server Name Based Routing configuration, you can rename the `nginx.example.conf` file to `nginx.conf` and modify it as needed or create your own configuration file and mount it to the Nginx container in the `docker-compose.prod.yml` file as shown below:

```yaml
  reverse-proxy:
    container_name: reverse_proxy
    image: nginx:latest
    ports:
      - 80:80
      - 8080:8080
      - 3032:3032
      - 3033:3033
    volumes:
      - ./reverse_proxy/your_nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - backend
      - frontend_storefront
      - frontend_dashboard
```

Please note that if you are using the Server Name Base Routing configuration, it's good practice to remove port mapping from the Nginx container in the `docker-compose.prod.yml` file.

The production environment can be started by running the following command in the `/src` directory:

```bash
docker compose -f docker-compose.prod.yml up -d
```

### Demo environment
The demo environment in Ecoseller is designed to showcase the platform's features and functionality using preloaded demo products (1400+), variants (2100+), and additional data. Setting up the demo environment is similar to the production environment, with the main difference being the utilization of the `docker-compose.demo.yml` file. It's very similar to `docker-compose.prod.yml` but it has some additional services that are used to preload the demo data into the database.
You can choose between using reverse proxy or accessing the services directly. However, it's recommended to use the reverse proxy configuration for the demo environment as well (please see the [Reverse Proxy](#reverse-proxy) section for more information as well ass [Production environment](#production-environment)).
Our demo data live at public repository [ecoseller/demo-data](https://github.com/ecoseller/demo-data)


The demo environment can be started by running the following command in the `/src` directory:

```bash
docker compose -f docker-compose.demo.yml up -d
```
If you compare `docker-compose.demo.yml` and `docker-compose.prod.yml`, you can see that main difference is in the build target of `backend` service where `demo` is utilized.
It means that there're different scripts ran on startup, namely `/src/backend/demo_data_loader.sh` which clones the repository and moves the data in propriate locations.
```bash
git clone https://github.com/ecoseller/demo-data.git
mv /usr/src/demo-data/media /usr/src/mediafiles
PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -U $POSTGRES_USER -d $POSTGRES_DB -p $POSTGRES_PORT -a -f /usr/src/demo-data/sql/mock_data.sql
```


**Also, please note, that the demo environment is not intended for production use. It's not setup for persistent storage so after you stop the containers all the data will be lost.**

![Product variants loaded to the database in demo envrionment](../../images/admin/db_product_productvariant_sql.png)



# Environment variables 
**ecoseller** utilizes environment variables to configure various aspects of the backend and recommendation system. These environment variables are stored in separate files, namely `docker-compose.env`. For the backend it's `src/backend/docker-compose.env` and `src/recommender_system/docker-compose.env` for recommendation system. Additionally, the storefront, dashboard, and other services have their environment variables directly specified in the  YAML file for specific docker compose.

## Backend <span id="env-backend"><span>
This is an example of `src/backend/docker-compose.env` file. You can use it as a template for your own configuration.
Please note that in this file you can configure Django backend and all the connections to other services that are used by the backend.
You can find more information about Django environment variables in the [official documentation](https://docs.djangoproject.com/en/4.2/ref/settings/).

### Example

```env
DEBUG=1 # 1 for development, 0 for production
DJANGO_ALLOWED_HOSTS="*" # for development only 

DATABASE=postgres
DB_ENGINE=django.db.backends.postgresql_psycopg2
POSTGRES_DB=ecoseller
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
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
This is an example of `src/recommender_system/docker-compose.env` file. You can use it as a template for your own configuration, but please note that you need to change the `RS_URL` variable to match the URL in your **ecoseller** backend. 
### Example
```env
RS_SERVER_HOST=0.0.0.0
RS_SERVER_PORT=8086
RS_SERVER_DEBUG=TRUE

POSTGRES_PASSWORD=zZvyAvzG2O5gfr5

RS_PRODUCT_DB_URL=postgresql://postgres:zZvyAvzG2O5gfr5@postgres_rs:5432/products
RS_FEEDBACK_DB_URL=postgresql://postgres:zZvyAvzG2O5gfr5@postgres_rs:5432/feedback
RS_SIMILARITY_DB_URL=postgresql://postgres:zZvyAvzG2O5gfr5@postgres_rs:5432/similarity
RS_MODEL_DB_URL=postgresql://postgres:zZvyAvzG2O5gfr5@postgres_rs:5432/model
```
# Reserved ports
When running **ecoseller**, it is important to be aware of the reserved ports used by the various services within the platform. Reserved ports ensure that different components of **ecoseller** can communicate with each other effectively through Docker internal network. Here are the reserved ports used in **ecoseller**:

* **Backend Service**: 
The Ecoseller backend service runs on port 8000 by default. This is the primary entry point for accessing the backend APIs.

* **PostgreSQL Backend**:
The Ecoseller backend PostgreSQL service is accessible on port 5433 by default. This is the primary entry point for accessing the backend PostgreSQL database.

* **Backend Redis**:
The Ecoseller backend Redis service is accessible on port 6379 by default. This is the primary entry point for accessing the backend Redis database.

* **Elasticsearch**:
The Elasticsearch service is accessible on port 9200 by default. This is the primary entry point for accessing the Elasticsearch database.

* **Dashboard**:
The dashboard service is accessible on port 3030 by default. This is the primary entry point for accessing the dashboard.

* **Storefront**:
The storefront service is accessible on port 3000 by default. This is the primary entry point for accessing the storefront.

* **Recommendation system**:
The recommendation system service is accessible on port 8086 by default. This is the primary entry point for accessing the recommendation system.

* **PostgreSQL Recommender system**:
The recommender PostgreSQL service is accessible on port 5432 by default. This is the primary entry point for accessing the recommender PostgreSQL database.



When deploying **ecoseller**, make sure that the necessary ports are accessible and properly configured in your firewall settings or network infrastructure to allow incoming and outgoing traffic to the respective services if you don't use proxy.

By understanding and managing the reserved ports, you can ensure smooth communication and access to the different components of Ecoseller, enabling seamless functionality and integration within your e-commerce platform.


