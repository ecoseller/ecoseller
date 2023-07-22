---
title: Recommender system
category: Programming documentation
order: 4
---

Table of contents:
* TOC
{:toc}

Recommender system is a web application that provides recommended products and their variants to the backend of the **ecoseller**.

This application is split into two docker containers - web server providing recommendations (`recommender_system`) and trainer
(`recommender_system_trainer`). The web server uses models prepared by the trainer to provide relevant products and their variants.
Only the web server has exposed API that is used by the backend. Trainer runs does not communicate with other components of **ecoseller**.
It reads Recommender system's database and checks if any model needs training. The trainer trains models if needed and prepares them for
the web server to be used.

# Architecture

The Recommender system's web server is implemented as a [Flask](https://flask.palletsprojects.com) application. The trainer is a simple
Python process as no API endpoints are exposed.

[Dependency injector](https://python-dependency-injector.ets-labs.org) is used throughout the application to handle proper initialization
and usage of all the components of the Recommender system. The web server includes a container that defines all the components that are
used via dependency injection. These components include storages and managers (*Cache manager*, *Data manager*, *Model manager*,
*Monitoring manager* and *Prediction pipeline*).

## API

There are several API endpoints exposed by the Recommender system.

### Healthcheck

There is a `GET` healthcheck endpoint at `/` that is used by Docker to check if Recommender system's web server is up and running. Trainer starts
running after this endpoint of the web server responds so that database migrations are run only once and only by the web server.

### Storing objects

There are two endpoints that handle storing objects to the Recommender system.

One handles only one object, the second saves list of objects, both are `POST` endpoints, their paths are `/store_object` and `/store_objects`,
respectively.

The data sent to this endpoint contain the class name of the object being saved along with the object's representation in JSON.
For more information about the data sent to this endpoint, see the [Data manager](#data-manager) section.

### Providing recommendations

The Recommender system provides the recommendations via two `POST` endpoints.

Endpoint at `/predict` returns list of product variant SKUs ordered by their relevance to the request.

Endpoint at `/predict/product_positions` returns a dictionary mapping product ID to the position of its most relevant product variant.

Only the category list ordering calls the second endpoint in order to create Django query that orders the products to be displayed in
the category list.

These endpoints expect the following data:
```
{
    "recommendation_type": str,  # "HOMEPAGE" | "PRODUCT_DETAIL" | "CATEGORY_LIST" | "CART"
    "session_id": str,
    "user_id": Optional[int],
    "category_id": int,
    "variants": List[str],
    "variants_in_cart": List[str],
    "limit": Optional[int],
}
```

Where `recommendation_type`, `session_id`, `user_id` and `limit` are expected for all recommendations. `category_id` is filled only
for category list ordering, `variants` for product detail recommendations (it contains SKUs of all variants of the current product)
and `variants_in_cart` for cart recommendations (it contains product variant SKUs in the current cart).

### Providing monitoring data

Monitoring data are obtained from the Recommender system via `GET` endpoint at `/dashboard`. It expects two arguments - `date_from`
and `date_to`, that specify for which time period the monitoring data should be displayed.

This endpoint returns all the data that are needed to be displayed on the dashboard. More details about the monitoring data are
described in [monitoring manager](#monitoring-manager) and dashboard's [recommender system](../user/dashboard#recommender-system) sections.

## Data manager

### API models

### Stored models

#### Many-to-many relations

## Storages

## ORM

## Cache

## Feedback

## Model

## Product

## Prediction model-specific

### Changing storage type

### Adding new storage

## Prediction models

### Dummy (level 0)

### Selection (level 1)

### Popularity (level 2)

### Similarity (level 3)

### GRU4Rec (level 4)

### EASE (level 5)

## Prediction pipeline

### Cache manager

### Model manager

## Monitoring manager

## Trainer

# Dockerization

## Entrypoint

# Configuration

# Unit testing

# Importing data