import csv
from datetime import datetime, timedelta, timezone
import logging
import random
from typing import Any, Dict, List, Set, Tuple
import uuid

from dependency_injector.wiring import inject, Provide

from recommender_system.models.stored.base import StoredBaseModel
from recommender_system.models.stored.feedback.product_add_to_cart import (
    ProductAddToCartModel,
)
from recommender_system.models.stored.feedback.product_detail_enter import (
    ProductDetailEnterModel,
)
from recommender_system.models.stored.feedback.session import SessionModel
from recommender_system.models.stored.product.attribute import AttributeModel
from recommender_system.models.stored.product.attribute_product_variant import (
    AttributeProductVariantModel,
)
from recommender_system.models.stored.product.attribute_type import AttributeTypeModel
from recommender_system.models.stored.product.attribute_type_product_type import (
    AttributeTypeProductTypeModel,
)
from recommender_system.models.stored.product.category_ancestor import (
    CategoryAncestorModel,
)
from recommender_system.models.stored.product.order import OrderModel
from recommender_system.models.stored.product.order_product_variant import (
    OrderProductVariantModel,
)
from recommender_system.models.stored.product.product import ProductModel
from recommender_system.models.stored.product.product_price import ProductPriceModel
from recommender_system.models.stored.product.product_product_variant import (
    ProductProductVariantModel,
)
from recommender_system.models.stored.product.product_type import ProductTypeModel
from recommender_system.models.stored.product.product_variant import ProductVariantModel
from recommender_system.storage.abstract import AbstractStorage
from recommender_system.storage.feedback.abstract import AbstractFeedbackStorage
from recommender_system.storage.product.abstract import AbstractProductStorage
from recommender_system.server.app import create_app

logging.basicConfig()
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

CHUNK_SIZE = 500_000


def bulk_create(models: List[StoredBaseModel], storage: AbstractStorage) -> None:
    logger.info(f"Saving {len(models):,} objects to database...")
    index = 0
    while index + CHUNK_SIZE < len(models):
        logger.info(f"{index:,} done...")
        storage.bulk_create_objects(models=models[index : index + CHUNK_SIZE])
        index += CHUNK_SIZE
    storage.bulk_create_objects(models=models[index:])


def fill_node_ancestors(
    node: str,
    edges: Set[Tuple[str, str]],
    current_ancestors: Set[str],
    ancestors: Dict[str, Set[str]],
) -> None:
    ancestors[node] = current_ancestors

    children = set()
    for child, parent in edges:
        if parent == node:
            children.add(child)

    for child in children:
        fill_node_ancestors(
            node=child,
            edges=edges,
            current_ancestors=current_ancestors | {node},
            ancestors=ancestors,
        )


@inject
def fill_ancestors(
    rows: List[List[str]],
    product_storage: AbstractProductStorage = Provide["product_storage"],
) -> None:
    nodes = set()
    for row in rows:
        for item in row:
            if item != "":
                nodes.add(item)
    edges = {(row[0], row[1]) for row in rows if row[1] != ""}

    roots = []
    logger.info("Finding roots...")
    for node in nodes:
        is_root = True
        for child, parent in edges:
            if child == node:
                is_root = False
                break
        if is_root:
            roots.append(node)

    ancestors: Dict[str, Set[str]] = {}
    logger.info("Finding ancestors...")
    for node in roots:
        fill_node_ancestors(
            node=node, edges=edges, current_ancestors=set(), ancestors=ancestors
        )

    logger.info("Getting category ancestors...")
    category_ancestors: List[CategoryAncestorModel] = []
    for category_id, ancestor_ids in ancestors.items():
        for ancestor_id in ancestor_ids:
            category_ancestors.append(
                CategoryAncestorModel(
                    category_id=category_id, category_ancestor_id=ancestor_id
                )
            )

    bulk_create(models=category_ancestors, storage=product_storage)


def fill_categories(product_storage: AbstractProductStorage) -> None:
    rows = []
    filename = "../data/category_tree.csv"
    with open(filename, "r") as file:
        rows += list(csv.reader(file, delimiter=","))[1:]

    fill_ancestors(rows=rows, product_storage=product_storage)


@inject
def fill_attribute_types(
    rows: List[List[str]],
    product_storage: AbstractProductStorage = Provide["product_storage"],
) -> None:
    logger.info("Filling attribute types...")

    logger.info("Getting numerical attribute types...")
    is_numerical = {}
    for row in rows:
        if row[2] not in ["available", "categoryid", "790"]:  # "790" is price
            if row[2] not in is_numerical:
                is_numerical[row[2]] = True
            is_numerical[row[2]] = (
                is_numerical[row[2]] and row[3].startswith("n") and " " not in row[3]
            )

    logger.info("Getting attribute types...")
    attribute_types = []
    for attribute_type, is_num in is_numerical.items():
        attribute_types.append(
            AttributeTypeModel(
                id=int(attribute_type),
                type=AttributeTypeModel.Type.NUMERICAL
                if is_num
                else AttributeTypeModel.Type.CATEGORICAL,
            )
        )

    bulk_create(models=attribute_types, storage=product_storage)


@inject
def fill_product_types(
    rows: List[List[str]],
    product_storage: AbstractProductStorage = Provide["product_storage"],
) -> None:
    logger.info("Filling product types...")

    logger.info("Getting categories and attribute types...")
    categories: Dict[str, str] = {}
    attribute_types: Dict[str, Set[str]] = {}
    for row in rows:
        if row[2] == "categoryid":
            categories[row[1]] = row[3]
        elif row[2] not in ["available", "790"]:
            if row[1] not in attribute_types:
                attribute_types[row[1]] = set()
            attribute_types[row[1]].add(row[2])

    logger.info("Getting common attribute types for categories...")
    intersections: Dict[str, Set[str]] = {}
    for product_type_id, category in categories.items():
        types = attribute_types.get(product_type_id, set())
        if category not in intersections:
            intersections[category] = types
        intersections[category] = intersections[category].intersection(types)

    logger.info("Getting product types...")
    product_types: Dict[str, ProductTypeModel] = {}
    for row in rows:
        if row[2] == "categoryid":
            update_at = datetime.utcfromtimestamp(int(row[0]) / 1_000)
            if row[3] not in product_types:
                product_types[row[3]] = ProductTypeModel(
                    id=int(row[3]),
                    name=row[3],
                    update_at=update_at,
                    create_at=update_at,
                )
            else:
                product_types[row[3]].update_at = update_at

    bulk_create(models=list(product_types.values()), storage=product_storage)

    attribute_type_product_types: List[AttributeTypeProductTypeModel] = []
    logger.info("Getting attribute type product types...")
    for product_type_id, attribute_type_ids in intersections.items():
        for attribute_type_id in attribute_type_ids:
            attribute_type_product_types.append(
                AttributeTypeProductTypeModel(
                    attribute_type_id=int(attribute_type_id),
                    product_type_id=int(product_type_id),
                )
            )

    bulk_create(models=attribute_type_product_types, storage=product_storage)


@inject
def fill_products(
    rows: List[List[str]],
    product_storage: AbstractProductStorage = Provide["product_storage"],
) -> None:
    logger.info("Filling products and product variants...")

    logger.info("Getting categories...")
    categories: Dict[str, str] = {}
    for row in rows:
        if row[2] == "categoryid":
            categories[row[1]] = row[3]

    logger.info("Getting products and product variants...")
    products: Dict[str, ProductModel] = {}
    product_variants: Dict[str, ProductVariantModel] = {}
    product_product_variants: List[ProductProductVariantModel] = []
    prices: Dict[str, ProductPriceModel] = {}
    i = ProductPriceModel.get_next_pk()
    for row in rows:
        update_at = datetime.utcfromtimestamp(int(row[0]) / 1_000)

        published = None
        price = None
        if row[2] == "available":
            published = row[3] == "1"
        elif row[2] == "790":
            price = float(row[3][1:])

        if row[1] not in products:
            products[row[1]] = ProductModel(
                id=int(row[1]),
                published=published is not None,
                category_id=categories.get(row[1]),
                update_at=update_at,
                create_at=update_at,
                product_type_id=int(row[1]),
            )
        else:
            if published is not None:
                products[row[1]].published = published
            products[row[1]].update_at = update_at

        if row[1] not in product_variants:
            product_variants[row[1]] = ProductVariantModel(
                sku=row[1],
                ean=row[1],
                stock_quantity=0 if published is None else 1,
                recommendation_weight=random.random(),
                update_at=update_at,
                create_at=update_at,
            )
            product_product_variants.append(
                ProductProductVariantModel(
                    product_id=int(row[1]), product_variant_sku=row[1]
                )
            )
        else:
            product_variants[row[1]].update_at = update_at

        if price is not None:
            if row[1] not in prices:
                prices[row[1]] = ProductPriceModel(
                    id=i,
                    price_list_code="RETAILROCKET",
                    product_variant_sku=row[1],
                    price=price,
                    update_at=update_at,
                    create_at=update_at,
                )
                i += 1
            else:
                prices[row[1]].price = price
                prices[row[1]].update_at = update_at

    bulk_create(models=list(products.values()), storage=product_storage)
    bulk_create(models=list(product_variants.values()), storage=product_storage)
    bulk_create(models=product_product_variants, storage=product_storage)
    bulk_create(models=list(prices.values()), storage=product_storage)


@inject
def fill_attributes(
    rows: List[List[str]],
    product_storage: AbstractProductStorage = Provide["product_storage"],
) -> None:
    logger.info("Filling attributes...")

    logger.info("Getting numerical attribute types...")
    is_numerical = {}
    for row in rows:
        if row[2] not in ["available", "categoryid", "790"]:  # "790" is price
            if row[2] not in is_numerical:
                is_numerical[row[2]] = True
            is_numerical[row[2]] = (
                is_numerical[row[2]] and row[3].startswith("n") and " " not in row[3]
            )

    logger.info("Getting attribute objects...")
    attributes: Dict[Tuple[str, str], AttributeModel] = {}
    attribute_product_variants: Dict[Tuple[str, str], AttributeProductVariantModel] = {}
    i = AttributeModel.get_next_pk()
    for row in rows:
        if row[2] not in ["available", "categoryid", "790"]:
            raw_value = row[3][:200]
            numeric_value = None
            if is_numerical[row[2]]:
                numeric_value = float(row[3][1:])
            attribute = attributes.get((row[2], raw_value))
            if attribute is None:
                attribute = AttributeModel(
                    id=i,
                    raw_value=raw_value,
                    numeric_value=numeric_value,
                    attribute_type_id=int(row[2]),
                )
                attributes[(row[2], raw_value)] = attribute
                i += 1
            attribute_product_variants[(row[1], row[2])] = AttributeProductVariantModel(
                attribute_id=attribute.id, product_variant_sku=row[1]
            )

    bulk_create(models=list(attributes.values()), storage=product_storage)
    bulk_create(
        models=list(attribute_product_variants.values()), storage=product_storage
    )


def fill_properties(product_storage: AbstractProductStorage) -> None:
    rows = []
    for filename in [
        "../data/item_properties_part1.csv",
        "../data/item_properties_part2.csv",
    ]:
        with open(filename, "r") as file:
            rows += list(csv.reader(file, delimiter=","))[1:]

    rows.sort(key=lambda row: row[0])

    fill_attribute_types(rows=rows, product_storage=product_storage)
    fill_product_types(rows=rows, product_storage=product_storage)
    fill_products(rows=rows, product_storage=product_storage)
    fill_attributes(rows=rows, product_storage=product_storage)


def fill_feedback(
    feedback_storage: AbstractFeedbackStorage, product_storage: AbstractProductStorage
) -> None:
    logger.info("Filling feedback...")

    with open("../data/events.csv", "r") as file:
        rows = list(csv.reader(file, delimiter=","))[1:]

    rows.sort(key=lambda row: row[0])

    session_histories: Dict[int, Any] = {}
    sessions: List[SessionModel] = []
    order_ids: Set[int] = set()
    orders: List[OrderModel] = []
    order_product_variants: List[OrderProductVariantModel] = []
    enters: List[ProductDetailEnterModel] = []
    add_to_carts: List[ProductAddToCartModel] = []

    for row in rows:
        create_at = datetime.utcfromtimestamp(int(row[0]) / 1_000)
        user_id = int(row[1])
        product_variant_sku = row[3]
        order_id = int(row[4]) if row[4] != "" else None
        if user_id not in session_histories or session_histories[user_id][
            "last_event"
        ].replace(tzinfo=timezone.utc) < datetime.now(timezone.utc) - timedelta(
            hours=1
        ):
            session_id = str(uuid.uuid4())
            session_histories[user_id] = {
                "last_event": create_at,
                "session_id": session_id,
            }
            sessions.append(
                SessionModel(
                    id=session_id,
                    user_id=user_id,
                )
            )
        session_histories[user_id]["last_event"] = create_at
        if row[2] == "view":
            enters.append(
                ProductDetailEnterModel(
                    session_id=session_histories[user_id]["session_id"],
                    user_id=user_id,
                    product_id=int(product_variant_sku),
                    product_variant_sku=product_variant_sku,
                    recommendation_type=None,
                    position=None,
                    create_at=create_at,
                )
            )
        elif row[2] == "addtocart":
            add_to_carts.append(
                ProductAddToCartModel(
                    session_id=session_histories[user_id]["session_id"],
                    user_id=user_id,
                    product_id=int(product_variant_sku),
                    product_variant_sku=product_variant_sku,
                    create_at=create_at,
                )
            )
        elif row[2] == "transaction":
            if order_id not in order_ids:
                order_ids.add(order_id)
                orders.append(
                    OrderModel(
                        id=order_id,
                        update_at=create_at,
                        create_at=create_at,
                        session_id=session_histories[user_id]["session_id"],
                    )
                )
            order_product_variants.append(
                OrderProductVariantModel(
                    amount=random.randint(1, 3),
                    order_id=order_id,
                    product_variant_sku=product_variant_sku,
                )
            )

    bulk_create(models=sessions, storage=feedback_storage)
    bulk_create(models=orders, storage=product_storage)
    bulk_create(models=order_product_variants, storage=product_storage)
    bulk_create(models=add_to_carts, storage=feedback_storage)
    bulk_create(models=enters, storage=feedback_storage)


if __name__ == "__main__":
    app = create_app()
    fill_categories(product_storage=app.container.product_storage())
    fill_properties(product_storage=app.container.product_storage())
    fill_feedback(
        feedback_storage=app.container.feedback_storage(),
        product_storage=app.container.product_storage(),
    )
