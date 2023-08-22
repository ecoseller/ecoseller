---
title: Supportive services
category: Programming documentation
order: 5
---

Table of contents:
* TOC
{:toc}


This section focuses on the seamless integration of additional supportive services such as Elasticsearch, Redis, and PostgreSQL with the Django backend, enhancing the functionality and performance of the ecoseller platform.

# Elasticsearch
Elasticsearch is a powerful search and analytics engine that enables fast and efficient full-text search capabilities in ecoseller. By integrating Elasticsearch with the Django backend, users can benefit from advanced search features, including filtering, ranking, and suggestions. Elasticsearch enhances the user experience by providing quick and accurate search results, making it an integral part of ecoseller's search functionality.

## Integration
The integration of Elasticsearch with the Django backend is achieved using the [Django Elasticsearch DSL](https://django-elasticsearch-dsl.readthedocs.io) and [Django Elasticsearch DSL DRF](https://drf-elasticsearch-dsl.readthedocs.io) packages. The Django Elasticsearch DSL package provides a simple API for defining Elasticsearch indexes, while the Django Elasticsearch DSL DRF package provides a set of classes and filters for integrating Elasticsearch with the Django REST framework.
The integration of these packages is done in `src/backend/core/core/settings.py` where are defined the Elasticsearch connection settings and the Elasticsearch index settings based on the `env` variables.
We use `USE_ELASTIC` variable to enable or disable the Elasticsearch integration. If `USE_ELASTIC` is set to `True`, the Elasticsearch integration is enabled, otherwise it is disabled. Indexes are created only if the Elasticsearch integration is enabled and are defined as `ELASTICSEARCH_INDEX_NAMES`.

## Analyzers 
The following analyzers are defined in ecoseller:
* `czech_autocomplete_hunspell_analyzer` - Czech analyzer for autocomplete based on the Hunspell dictionary
* `slovak_autocomplete_hunspell_analyzer` - Slovak analyzer for autocomplete based on the Hunspell dictionary
* `general_autocomplete_hunspell_analyzer` - General analyzer for autocomplete based on the Hunspell dictionary for english

Please refer to `src/backend/core/search/analyzers.py` for more details. Hunspell dictionaries are downloaded on the build of Elasticsearch container.


## Indexes
Ecoseller is indexing products so that users can search in products. The following index is defined for products:
### `products`
This index is used to store the product information. It is defined in `src/backend/core/products/documents.py` and is based on the `Product` model defined in `src/backend/core/products/models.py`.
Following data are stored:
* `id` - the product id
* `title` - dictionary with the product title in different languages (and different analyzers)
* `short_description` - dictionary with the product short description in different languages (and different analyzers)
* `attribute_list` - list of dictionaries with the product attributes sepperated by comma in different languages (and different analyzers)

## Search
In order to retrive indexed data, ecoseller uses `PaginatedElasticSearchAPIView` in the `src/backend/core/search/views.py` for HTTP requests. 
This view has to be extended by a view that defines the `serializer_class` and `document_class` attributes. Also it's neccessary to define custom `generate_q_expression` method that will be used for querying. For example, we can see `SearchProducts` defined in `src/backend/core/products/views.py`.

```python
class SearchProducts(PaginatedElasticSearchAPIView):
    serializer_class = ProductStorefrontListSerializer
    document_class = ProductDocument
    serializer_as_django_model = True

    def generate_q_expression(self, query):
        return Q(
            "multi_match",
            query=query,
            fields=[
                "id^10.0",
                f"title.{self.langauge}^5.0",
                f"short_description.{self.langauge}^3.0",
                f"attribute_list.{self.langauge}^2.0",
            ],
        )
```
For more information about creating `Q` expressions, please refer to 
Elasticsearch DSL documentation [here](https://elasticsearch-dsl.readthedocs.io/en/latest/search_dsl.html#queries).

## Indexing products to Elasticsearch

To ensure efficient product searches and recommendations within Ecoseller, it is crucial to index your products in Elasticsearch. ecosellerprovides a convenient CLI command within the backend container to perform this indexing process.

To index your products using the CLI command, follow these steps:

1. Access the `backend` container: If you are running ecoseller locally using Docker, open your terminal and navigate to the ecosellerproject directory. Use the following command to access the `backend` container: `docker exec -it <your_backend_container_id_or_name> /bin/bash`
2. Run the indexing command: Once inside the `backend` container, run the following command to index the products in Elasticsearch: `python3 manage.py search_index --rebuild`
This command triggers the indexing process, where the products will be parsed, analyzed, and stored in Elasticsearch for efficient searching and recommendation functionalities.

Note: Ensure that you are in the correct directory within the backend container (usually the project's root directory) before executing the command.

The indexing process may take some time, depending on the size of your product database. Once the process is complete, your products will be fully indexed and ready for efficient searching and recommendation generation within Ecoseller.


### Automation with CRON job
You can also automate the indexing process by scheduling a CRON job to run the indexing command at specified intervals. This ensures that your Elasticsearch index stays up to date with any changes in your product database. Set up a CRON job with the following command:
`0 2 * * * docker exec <your_backend_container_id_or_name> python3 manage.py search_index --rebuild`

## Turning off Elasticsearch
If you no longer wish to use Elasticsearch in your ecosellersetup, you can easily disable it by adjusting the environment variables and stopping the Elasticsearch container. Follow the steps below to turn off Elasticsearch:
1. Update environment variables: (please see dedicated section for environment variables in the installation guide) Set the `USE_ELASTIC` variable to `0` in the `backend` env file.
2. Stop the Elasticsearch container
3. Restart the `backend` container

With these steps completed, Elasticsearch will be disabled in your ecosellersetup. However, please note that this will also disable the fast search functionality within Ecoseller. Therefore, it is recommended to keep Elasticsearch enabled for user experience.



# Redis
Redis, an in-memory data structure store, is utilized in ecoseller. By integrating Redis with the Django backend, ecoseller leverages its key-value store capabilities to efficiently manage and process background tasks. 

## Integration
The integration of Redis and mainly Redis Queue with the Django backend is achieved using the [Django RQ](https://github.com/rq/django-rq).
There's a special flag defined as `env` variable `USING_REDIS_QUEUE` that enables or disables the Redis Queue integration.

## Redis Queue
Redis Queue is used for running background tasks. For example, we can take a look at `src/backend/core/emails/email/base.py` with class `Email` that is used to inherit from when creating new email classes. This class defines `send` method that is used to send emails in the background. Since sending e-mails from main thread can take a long time, we use Redis Queue to send emails in the background. 

```python
def send(self):
    self.generate_subject()
    self.generate_context()

    queue = django_rq.get_queue(
        "high", autocommit=True, is_async=True, default_timeout=360
    )

    args = (
        self.subject,
        "",
        settings.EMAIL_FROM,
        self.recipient_list,
    )

    kwargs = {"html_message": self.generate_msg_html()}

    if self.use_rq:
        queue.enqueue(
            send_mail,
            args=args,
            kwargs=kwargs,
            meta=self.meta,
        )
    else:
        send_mail(*args, **kwargs)
```

The message is simply attached to the queue and the queue is processed in the background. 

## Worker 
In order to process the queue, we need to run a worker. We can do that by running `python manage.py rqworker` command. This command will start a worker that will process the queue.
However single worker is already included in all Docker Compose files supplied with ecoseller.

# PostgreSQL
PostgreSQL, a robust and feature-rich open-source relational database, forms the core of ecoseller's data storage and management. By integrating PostgreSQL with the Django backend, ecoseller ensures secure, reliable, and scalable storage for critical data, such as product information, user details, and order history. PostgreSQL's advanced features, including ACID compliance and support for complex data structures, make it an excellent choice for managing structured data in ecoseller.

## Integration
The integration of PostgreSQL with the Django backend is achieved using the [psycopg2](https://www.psycopg.org/) package. The PostgreSQL connection settings are defined in `src/backend/core/core/settings.py` based on the `env` variables.

Since Django ORM is used for database management, the integration of PostgreSQL is done automatically by Django. 
