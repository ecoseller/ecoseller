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

Data manager handles all data coming to the Recommender system. It stores objects to the corresponding storage inside the Recommender system.

Data manager obtains data from the request, parses API model(s) from them, converts them to Stored models and then saves those Stored models
to the appropriate storage.

### API models

API models are objects, that correspond to the format which is sent via API. Each API model is a subclass of [Pydantic](https://docs.pydantic.dev)'s
`BaseModel`.

Parsing these models by the Data manager is handled by mapping a field `_model_class` to the corresponding API model's type and then parsing the
data using `parse_obj` method.

Each API model has `save` method, that performs the conversion to Stored model and saves that model to the storage.

API models include the following objects:

- `Attribute`
- `AttributeType`
- `Category`
- `Config`
- `Order`
- `Product`
- `ProductAddToCart`
- `ProductDetailEnter`
- `ProductDetailLeave`
- `ProductPrice`
- `ProductTranslation`
- `ProductType`
- `ProductVariant`
- `RecommendationView`
- `Review`

### Stored models

Stored models represent objects that are stored into a storage, but they are storage-implementation independent. This means that changing storage from
SQL to filesystem does not affect these objects in any way. All operations with their storage are done by calling the appropriate methods on that storage.
Each model has its storage as a `_storage` attribute that is set during the model's initialization.

These models are also subclasses of the Pydantic's `BaseModel`, this makes it easy to work with [SQLAlchemy ORM](https://docs.sqlalchemy.org/en/20/orm/).

#### Immutable

Some objects are immutable, editing these objects raises `TypeError`. These objects can only be created once.

#### Many-to-many relations

Several objects represent *many-to-many* relations, for example `ProductModel` and `ProductVariantModel` have *many-to-many* relation among them.

Related models can be obtained by calling the `get_target_model_class` of the `ManyToManyRelationMixin`, which provides you with the `target_model_class`,
and primary key field names of both classes of this relation. This allows the storage to implement just one general method to obtain *many-to-many* related
objects.

## Storages

The Recommender system uses several storages to store the objects it needs to provide recommendations.

Each storage is initialized as a Singleton in the application's container and is accessed via dependency injection.

### ORM

Working with SQL (via [SQLAlchemy](https://www.sqlalchemy.org)) takes advantage of its ORM functionality. Tables are defined as subclasses of SQLAlchemy's
`DeclarativeBase`. Mapping from Stored models to those table definitions is performed by `SQLModelMapper`, each table object has `origin_model` attribute
of its `Meta` class to tell the mapper which Stored model to map to which table.

### Cache

Cache storage is implemented as a filesystem storage. It saves category list recommendations performed by the Recommender system.

It has limited size since old data will not be used once a session ends.

More information about this storage's usage is described in the [Cache manager](#cache-manager) section.

### Feedback

Feedback storage is implemented as a PostgreSQL database. All models regarding feedback data are stored here. They include the following:

- `ProductDetailEnterModel`
- `ProductDetailLeaveModel`
- `ProductAddToCartModel`
- `ReviewModel`
- `RecommendationViewModel`

There are two other models stored in this storage: `PredictionResultModel` and `SessionModel`. Prediction results are stored here so that
monitoring manager can evaluate user feedback data based on the provided recommendations by applying SQL joins inside a single database.

### Model

Model storage includes models that are related to the prediction models in general. The following models are stored here:

- `ConfigModel` that contains configuration of the whole Recommender system
- `LatestIdentifierModel` that contains the identifier of the latest trained model for each of the prediction models
- `TrainerQueueItemModel` that represents item in the queue of the prediction models to be trained
- `TrainingStatisticsModel` that contains statistics describing each training performed by the Recommender system

Model storage is implemented as a PostgreSQL database.

### Product

Product storage is a PostgreSQL database containing all product-related models. They are stored in the same format as in Django backend
application, some models or fields are missing as they are not needed by the Recommender system.

Converting those objects to a more Recommender system-friendly structure is done during training in order to keep the complexity of storing
models as low as possible.

### Prediction model-specific

Some prediction models have their own storages implemented, namely *EASE* (filesystem), *GRU4Rec* (filesystem) and *Similarity* (PostgreSQL).
These storages are used to store the models parameters that are loaded when given model is being used. *Similarity* model also saves distances
of all product variants into the database and performs ordered queries on those data during prediction.

More information about these storages is provided in the sections describing the prediction models themselves.

### Migrations

All SQL storages use [Alembic](https://alembic.sqlalchemy.org) to manage migrations. Each storage has its own `alembic.ini` file and `alembic`
folder containing its versions.

Each `alembic.ini` file contains path to the migration script of the corresponding file that runs the migrations (`env.py`), this file needs
to have `target_metadata` variable assigned to the proper base class in order to generate the correct migrations.

### Changing storage type

In order to change storage type (for example changing *EASE* storage from filesystem to SQL) the following steps are necessary:

1. Create a new subclass of the `SQLBase` class located in the file `recommender_system/storage/sql/models/base.py`.
2. Define the tables by subclassing the created base class in a newly created file `recommender_system/storage/sql/models/ease.py`.
3. Create a new subclass of the appropriate *Abstract storage class* (in this case `AbstractEASEStorage`) and implement all the defined methods. Make this class a subclass of `SQLStorage` as well to be able to use SQL-specific functionality.
4. Change the Dependency injector's Singletion initialization in the application's container to this new class.
5. Create new database for this storage in the `../setup_database.sql` file, add connection string to environment variables files and use this connection string when initializing the storage in the container.
6. Add this storage to the `recommender_system/scripts/migrate.py` file so that migrations are applied when the **ecoseller** starts.
7. Copy `alembic.ini` file and `alembic` folder from different SQL storage and adjust paths and metadata as described in the [migrations](#migrations) section above. Delete all version files.
8. Generate migrations by running `python3 -m recommender_system.scripts.makemigrations {storage_name}` (`{storage_name}` in this case is `ease_storage`).

*All paths above are relative to `src/recommender_system/app`.*

To add a new storage, use similar process to the one described above, it does not differ much.

## Prediction models

The Recommender system contains several prediction models that perform the recommendations. This section describes the models, their usage is described in the [Prediction pipeline](#prediction-pipeline) section.

Each model's task is to select a subset of product variant from the Product storage. Input differs based on the type of recommendation, the differences are described in the [Prediction pipeline](#prediction-pipeline) section.

Some of the models can not be used in all situations based on their properties.

### Dummy (level 0)

This is the simplest model, which is used only if an error occurs when more complex models perform their prediction.

Dummy model returns randomly selected subset of product variants.

This model does not need any training.


### Selection (level 1)

This model is also randomized, but users can select product variants that should be recommended more often. Each product variant has its recommendation weight specified,
this value is used as weight when the random sampling is performed.

This model does not need any training.

### Popularity (level 2)

Popularity-based model tends to recommend popular product variants more. The popularity is represented by the number of orders of that product variant.

The recommendations are sampled, similarly to the Selection model, popularity is used as the sampling weight.

[//]: # (TODO: Change popularity definition)

This model does not need any training.

### Similarity (level 3)

Similarity-based model is a content-based model. It recommends the most similar product variants to the product variant passed as input.

Training computes distances of all pairs of product variants and saves them to the Similarity storage. Each record contains identifier of
the model, SKUs of both product variants and their distance.

This model selects the closest product variants to the given product variant during prediction.

During training, each product variant is represented by two vectors. One is in numerical attribute space, the second in categorical attribute space.

Vectors contain values of all existing attributes so that product variants of different product types can be compared.

If a product variant has no value of a numerical attribute, the average value is used.

If a product variant has no value of a categorical attribute, the most common value is used.

The distance of two product variants is computed as addition of Euclidean distances in numerical and categorical space.
Distance in each space is multiplied by a coefficient that decreases when the product variants share more attributes.
This coefficient is defined as the size of union of the attributes defined for the product variants divided by the size
intersection of the attributes defined for the product variants.

If product variant $p$ has $m$ attributes, product variant $q$ has $n$ attributes and they share $k$ product variants,
then the coefficient is $\frac{m + n - k}{k}$. If $k=0$, then the coefficient is $m + n$.

### GRU4Rec (level 4)

This is a session-based model based on [this article](https://arxiv.org/abs/1706.03847).

It uses a recurrent neural network. The input of the network is a vector representing the current session. Each value of
the input vector represents one product variant. The session is represented as a list of visited product variants, each
visited product variant has value of $x^k$ where $x \in [0,1]$ is a parameter of this model and $k$ is the number of product
variants visited after that product variant.

The neural network used here consists of three layers: embedding, GRU and output. Embedding and output layers are linear.

The output of the network consists of scores for each product variant, the product variants with the highest scores are selected.

### EASE (level 5)

EASE is a collaborative-filtering model. This model approximates a user-item rating matrix. Value at position $(i,j)$ is
user $i$'s rating of item $j$.

[//]: # (TODO: Change rating definition)

The [EASE algorithm](https://arxiv.org/abs/1905.03375) predicts the user's preferences by a dot product the user's representation
and a matrix it computes during training. The user is represented by a vector of ratings of all the project variants - it is
basically the same as a row in the user-item rating matrix.

The output contains estimated ratings of all the product variants, the top-rated ones are recommended to the user.

The training computes the matrix that is used during prediction, it is done by inversion of a slightly modified user-item rating
matrix. The resulting matrix's diagonal is set to 0.

### Adding new prediction model

New prediction models can be implemented and added to be used by the Recommender system by following the steps below:

1. Create class of your model by subclassing `AbstractPredictionModel` and implementing its abstract methods.
2. Add your class to `ModelManager`'s `get_all_models` method.
3. Add your model to cascade on dashboard, so it can be used by the Recommender system.

## Prediction pipeline

Prediction pipeline takes care of recommending products. It consists of three phases - retrieval, scoring and ordering.

#### Retrieval

Retrieval phase of prediction pipeline selects product variants to be considered when recommending product variants to the user. It typically
uses simple models so that the time complexity is kept low.

The default number of selected product variants is 1000. This step is different for category list recommendations - product variants of given
category are selected in that case.

#### Scoring

Scoring phase orders the retrieved product variants based on scores obtained from the used prediction model.

#### Ordering

Ordering phase of the prediction pipeline re-orders the top product variants obtained by the scoring phase.

It takes the top $k$ (default is 50) product variants and maximizes the *intra list distance* among them.
This phase uses the Similarity prediction model, this phase is skipped if the model is not ready.

### Cache manager

The recommendations provided by the prediction pipeline are cached. Only category list recommendations are cached. Only
the category that was visited last by a user is cached.

The cache size can hold up to 1000 items by default. This value can be changed via `RS_CACHE_SIZE` environment variable.

[//]: # (TODO: Config instead of env var)

### Model manager

The models used in the retrieval and scoring phases are selected by *Model manager*. The model is selected from the corresponding cascade.
Cascade is an ordered list of models where if the first one is not available, the second is used. If no model is available, Dummy model is used -
this one is available all the time.

There are cascades for all recommendation situations (homepage, product detail, category list and cart) and both phases of the pipeline (without
retrieval for category list).

## Monitoring manager

Monitoring data to be displayed on dashboard are prepared by monitoring manager. It simply selects prediction and training-related data from the database.

## Trainer

Trainer runs in a separate container to keep the Recommender system's response fast.

It checks a database containing items representing training requests and once there are new requests, it starts training the corresponding prediction model.

# Dockerization

The recommender system consists of one server (Recommender system), one trainer and one PostgreSQL instance.

The Recommender system uses Gunicorn in production mode, default Flask WSGI otherwise.

Only the recommender system's server performs database migrations, this is possible due to healthchecks of PostgreSQL and the Recommender system's server.
PostgreSQL instance is started first, once it is up and running, the Recommender system's server starts. It performs migrations and starts the server.
Once the server is started and starts responding, the trainer is started with all its dependencies ready.

# Configuration

The Recommender system is configured via `ConfigModel` object that contains options for the Recommender system as a whole as well as
for individual prediction models.

This object is editable from dashboard, each version is saved to the database with the appropriate timestamp to keep track of changes.
The most current version is used each time the configuration is being accessed.

# Importing data

It is possible to import data from two datasets to the Recommender system to test its offline performance.

Both datasets fill the storages with product and feedback data. 

## Demo

Demo data are imported to the Recommender system using `mock_data_rs_feedback.sql` and `mock_data_rs_products.sql`
[scripts](https://github.com/ecoseller/demo-data/tree/master/sql) during container initialization. These contain product
and feedback data representing a subset of [MovieLens dataset](https://movielens.org).

Product variant sequences visited by the users were generated randomly.

These data are imported when the `demo` version of *ecoseller*'s `docker-compose` file is used:
```shell
docker compose -f docker-compose.demo.yaml up
```

This dataset contains ~ 1000 products, ~ 2000 product variants and ~ 500 users.

## Retailrocket

[Retailrocket RS dataset](https://www.kaggle.com/datasets/retailrocket/ecommerce-dataset) can be imported to the Recommender system as well.

It is necessary to save the files of the dataset into the folder `src/recommender_system/data`. Running the script
`recommender_system/scripts/fill_data.py` saves those data to the database.

The whole Retailrocket dataset contains over 400k products and over 1M users.

# Unit testing

The Recommender system contains several unit tests to ensure proper functionality of individual components of the Recommender system.

The tests are written using [`pytest` framework](https://pytest.org).