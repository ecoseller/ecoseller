---
title: Administration
category: Administration documentation
order: 2
---

Table of contents:
* TOC
{:toc}

# Working with ecoseller REST API
The ecosellerplatform provides a comprehensive and powerful REST API that allows developers to interact with and extend the functionality of the e-commerce platform. This section of the documentation focuses on working with the ecosellerREST API and provides detailed guidance on utilizing its endpoints and authentication mechanisms. Please note that the ecosellerREST API was designed to be used primarily for dashboard purposes and is not intended to be used as a public API for the ecosellerplatform. However, feel free to use it as you see fit.
On the other hand, please consider using `NotificationAPI` for public API purposes and calling external services directly from ecosellerbackend.
## Authentication
Ecoseller's REST API authentication relies on JSON Web Tokens (JWT) to secure and authorize API requests. JWT is a compact and self-contained token format that securely transmits information between parties using digitally signed tokens. In the context of ecoseller, JWTs are utilized to authenticate and authorize API access intended for dashboard.
### Obtaining a JWT
To obtain a JWT, you need to send a POST request to the `/user/login/` endpoint with the following payload:
```json
{
    "email": "your_email",
    "password": "your_password",
    "dashboard_login": true
}
```

If the provided credentials are valid, the API will return a response containing the JWT token:
```json
{
    "access": "your_access_token",
    "refresh": "your_refresh_token"
}
```

The `access` token is used to authenticate API requests, while the `refresh` token is used to obtain a new access token once the current one expires. The access token is valid for 5 minutes, while the refresh token is valid for 24 hours. To obtain a new access token, you need to send a POST request to the `/user/refresh-token/` endpoint with the following payload:
```json
{
    "refresh": "your_refresh_token"
}
```

If the provided refresh token is valid, the API will return a response containing the new access token:
```json
{
    "access": "your_new_access_token"
}
```

### Using a JWT

Once you obtain a JWT, you need to include it in the `Authorization` header of your API requests. The header should have the following format:
```
Authorization: JWT your_access_token
```

## API documentation
The ecoseller backend provides a comprehensive API documentation that can be accessed by navigating to the `/api/docs/` endpoint. This documentation is generated automatically using the [drf-yasg](https://drf-yasg.readthedocs.io/en/stable/) package and provides detailed information about the available endpoints, their parameters, and the expected responses. 
Please make sure to use primairly `/dashboard` endpoints since they're designed to to modify data and require authentication. Storefront endpoints don't.

# User management
The user management functionality in **ecoseller's** dashboard allows administrators to create and manage user accounts with various roles and permissions. This section of the administration documentation focuses on the process of creating a initial user in ecoseller using the Django Command-Line Interface (CLI).

A admin is a special type of user account which has access to all administrative functions and controls within the ecoseller platform. Creating an initial admin user is an essential step in setting up your ecoseller administration panel, as it provides you with all privileges to manage and configure your e-commerce platform.
All other admin users can be allways setup in the dashboard, but you need at least one user to be able to login to the dashboard.
For more information about roles, permissions and users in general, please refer to [Authorization section in admin. documentation](./authroization).

## Creating an initial admin user without dashboard
Creating an admin user without dashboard can be done through the Django CLI. To do so, run the following command:
```bash
python3 manage.py createsuperuser
```

# Managing database
ecoseller utilizes a PostgreSQL database to store and manage data. This section of the documentation focuses on managing a PostgreSQL database within a Docker container and connecting it to a Django and Recommender system application.

## Django <-> PostgreSQL connection
The Django application is configured to connect to a PostgreSQL database using the following environment variables:
```env
POSTGRES_DB=ecoseller
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=postgres_backend
POSTGRES_PORT=5432
```

## Recommender system <-> PostgreSQL connection
The Recommender system's application is configured to connect to several PostgreSQL databases using the following environment variables:
```env
RS_PRODUCT_DB_URL=postgresql://postgres:zZvyAvzG2O5gfr5@postgres_rs:5432/products
RS_FEEDBACK_DB_URL=postgresql://postgres:zZvyAvzG2O5gfr5@postgres_rs:5432/feedback
RS_SIMILARITY_DB_URL=postgresql://postgres:zZvyAvzG2O5gfr5@postgres_rs:5432/similarity
RS_MODEL_DB_URL=postgresql://postgres:zZvyAvzG2O5gfr5@postgres_rs:5432/model
```
where each environment variable defines a connection string to one database.

## Binding database to a local folder
To persist the data in the PostgreSQL container, you can bind a local folder on your host machine to the container's data directory using Docker Compose.
In your docker-compose.yml file, add the following volume configuration under the services section for the `postgres_backend` and `postgres_rs` container:
```yaml
volumes:
    - ./backend/postgres/data:/var/lib/postgresql/data/
```
This configuration ensures that the PostgreSQL data is stored in the `./src/backend/postgres` folder on your local machine.
## Running migrations
It shouldn't be necessary to run migrations manually, but if you need to do so, you can run the following commands in the `backend` container:
```bash
python3 manage.py makemigrations
python3 manage.py migrate
```
or the following commands in the `recommender_system` container:
```bash
python3 -m recommender_system.scripts.makemigrations {storage_name}
python3 -m recommender_system.scripts.migrate
```
where `{storage_name}` is one of `feedback_storage`, `model_storage`, `product_storage` or `similarity_storage`. This also creates migrations if there is a change in one of the storages.
For more information about the Recommender system's storages, see [storages section](../../programming/recommender_system#storages) of the Recommender system page in the programming documentation.

## Backing up database
It is crucial to regularly back up your PostgreSQL database to prevent data loss and ensure data integrity.
Use the pg_dump utility to create a backup of the database. Run the following command to back up the database to a file:
```bash
pg_dump -U your_username -d your_database_name -f /path/to/backup.sql

```
Replace `your_username` and `your_database_name` with the appropriate values. Specify the path where you want to save the backup file.
## Restoring database
To restore a PostgreSQL database from a backup file, use the pg_restore utility.
Run the following command to restore the database from a backup file:
```bash
pg_restore -U your_username -d your_database_name /path/to/backup.sql
```
Replace `your_username`, `your_database_name`, and `/path/to/backup.sql` with the appropriate values.

# Indexing products to Elasticsearch

The process of indexing products is described in [programming docs](/programming/supportive_services/#indexing-products-to-elasticsearch)  
You can also watch [our video tutorial](/user/getting_started/#browsing--indexing-products).
