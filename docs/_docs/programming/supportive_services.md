---
title: Supportive services
category: Programming documentation
order: 5
---

Table of contents:
* TOC
{:toc}


This section focuses on the seamless integration of additional supportive services such as Elasticsearch, Redis, and PostgreSQL with the Django backend, enhancing the functionality and performance of the **ecoseller** platform.

# Elasticsearch
Elasticsearch is a powerful search and analytics engine that enables fast and efficient full-text search capabilities in **ecoseller**. By integrating Elasticsearch with the Django backend, users can benefit from advanced search features, including filtering, ranking, and suggestions. Elasticsearch enhances the user experience by providing quick and accurate search results, making it an integral part of **ecoseller**'s search functionality.

## Integration
The integration of Elasticsearch with the Django backend is achieved using the [Django Elasticsearch DSL](https://django-elasticsearch-dsl.readthedocs.io) and [Django Elasticsearch DSL DRF](https://drf-elasticsearch-dsl.readthedocs.io) packages. The Django Elasticsearch DSL package provides a simple API for defining Elasticsearch indexes, while the Django Elasticsearch DSL DRF package provides a set of classes and filters for integrating Elasticsearch with the Django REST framework.
The integration of these packages is done in `src/backend/core/core/settings.py` where are defined the Elasticsearch connection settings and the Elasticsearch index settings based on the `env` variables.
We use `USE_ELASTIC` variable to enable or disable the Elasticsearch integration. If `USE_ELASTIC` is set to `True`, the Elasticsearch integration is enabled, otherwise it is disabled. Indexes are created only if the Elasticsearch integration is enabled and are defined as `ELASTICSEARCH_INDEX_NAMES`.

## Analyzers 
The following analyzers are defined in **ecoseller**:
* `czech_autocomplete_hunspell_analyzer` - Czech analyzer for autocomplete based on the Hunspell dictionary
* `slovak_autocomplete_hunspell_analyzer` - Slovak analyzer for autocomplete based on the Hunspell dictionary
* `general_autocomplete_hunspell_analyzer` - General analyzer for autocomplete based on the Hunspell dictionary for english

Please refer to `src/backend/core/search/analyzers.py` for more details. Hunspell dictionaries are downloaded on the build of Elasticsearch container.


## Indexes
The following indexes are defined in **ecoseller**:
### `products`
This index is used to store the product information. It is defined in `src/backend/core/products/documents.py` and is based on the `Product` model defined in `src/backend/core/products/models.py`.
Following data are stored:
* `id` - the product id
* `title` - dictionary with the product title in different languages (and different analyzers)
* `short_description` - dictionary with the product short description in different languages (and different analyzers)
* `attribute_list` - list of dictionaries with the product attributes sepperated by comma in different languages (and different analyzers)

## Search
In order to retrive indexed data, **ecoseller** uses `PaginatedElasticSearchAPIView` in the `src/backend/core/search/views.py` for HTTP requests. 
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

# Redis
Redis, an in-memory data structure store, is utilized in **ecoseller**. By integrating Redis with the Django backend, **ecoseller** leverages its key-value store capabilities to efficiently manage and process background tasks. 

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
However single worker is already included in all Docker Compose files supplied with **ecoseller**.

# PostgreSQL
PostgreSQL, a robust and feature-rich open-source relational database, forms the core of **ecoseller**'s data storage and management. By integrating PostgreSQL with the Django backend, **ecoseller** ensures secure, reliable, and scalable storage for critical data, such as product information, user details, and order history. PostgreSQL's advanced features, including ACID compliance and support for complex data structures, make it an excellent choice for managing structured data in **ecoseller**.

## Integration
The integration of PostgreSQL with the Django backend is achieved using the [psycopg2](https://www.psycopg.org/) package. The PostgreSQL connection settings are defined in `src/backend/core/core/settings.py` based on the `env` variables.

Since Django ORM is used for database management, the integration of PostgreSQL is done automatically by Django. 
