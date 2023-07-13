---
title: Administration
category: Administration documentation
order: 3
---

# Working with **ecoseller** REST API
## Authentication
## API documentation

# User management

## Creating a superuser


## Roles and permissions

# Managing database

## Binding database to a local folder

## Running migrations

## Backing up database

## Restoring database


# Static files and media

# Implementing payment methods (`PaymentAPI`)

# Connecting external services (`NotificationAPI`)

# Search engine
**ecoseller** incorporates Elasticsearch as a component of its technology stack. Elasticsearch is a powerful search engine that enables **ecoseller** to deliver fast and accurate search results.
## Indexing products to Elasticsearch

To ensure efficient product searches and recommendations within Ecoseller, it is crucial to index your products in Elasticsearch. Ecoseller provides a convenient CLI command within the backend container to perform this indexing process.

To index your products using the CLI command, follow these steps:

1. Access the `backend` container: If you are running **ecoseller** locally using Docker, open your terminal and navigate to the Ecoseller project directory. Use the following command to access the `backend` container: `docker exec -it <your_backend_container_id_or_name> /bin/bash`
2. Run the indexing command: Once inside the `backend` container, run the following command to index the products in Elasticsearch: `python3 manage.py search_index --rebuild`
This command triggers the indexing process, where the products will be parsed, analyzed, and stored in Elasticsearch for efficient searching and recommendation functionalities.

Note: Ensure that you are in the correct directory within the backend container (usually the project's root directory) before executing the command.

The indexing process may take some time, depending on the size of your product database. Once the process is complete, your products will be fully indexed and ready for efficient searching and recommendation generation within Ecoseller.


### Automation with CRON job
You can also automate the indexing process by scheduling a CRON job to run the indexing command at specified intervals. This ensures that your Elasticsearch index stays up to date with any changes in your product database. Set up a CRON job with the following command:
`0 2 * * * docker exec <your_backend_container_id_or_name> python3 manage.py search_index --rebuild`

## Turning off Elasticsearch
If you no longer wish to use Elasticsearch in your Ecoseller setup, you can easily disable it by adjusting the environment variables and stopping the Elasticsearch container. Follow the steps below to turn off Elasticsearch:
1. Update environment variables: (please see dedicated section for environment variables in the installation guide) Set the `USE_ELASTIC` variable to `0` in the `backend` env file.
2. Stop the Elasticsearch container
3. Restart the `backend` container

With these steps completed, Elasticsearch will be disabled in your Ecoseller setup. However, please note that this will also disable the fast search functionality within Ecoseller. Therefore, it is recommended to keep Elasticsearch enabled for user experience.

