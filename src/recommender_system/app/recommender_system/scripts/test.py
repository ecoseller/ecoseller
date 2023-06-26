import csv
from datetime import datetime
import json
import logging
from typing import List

from flask import Flask

from recommender_system.models.prediction.gru4rec.model import GRU4RecPredictionModel
from recommender_system.models.prediction.ease.model import EASEPredictionModel
from recommender_system.models.prediction.similarity.model import (
    SimilarityPredictionModel,
)
from recommender_system.models.stored.feedback.product_add_to_cart import (
    ProductAddToCartModel,
)
from recommender_system.models.stored.feedback.product_detail_enter import (
    ProductDetailEnterModel,
)
from recommender_system.models.stored.feedback.session import SessionModel
from recommender_system.models.stored.model.training_statistics import (
    TrainingStatisticsModel,
)
from recommender_system.models.stored.product.product import ProductModel
from recommender_system.models.stored.product.product_variant import ProductVariantModel
from recommender_system.scripts.fill_data import (
    fill_categories,
    fill_types,
    fill_properties,
    fill_feedback,
)
from recommender_system.server.app import create_app

logging.basicConfig(level=logging.DEBUG)

LIMIT = 50_000


def get_item_ids() -> List[str]:
    logging.info("Getting item IDs")

    rows = []
    for filename in [
        "../data/item_properties_part1.csv",
        "../data/item_properties_part2.csv",
    ]:
        with open(filename, "r") as file:
            rows += list(csv.reader(file, delimiter=","))[1:]

    rows.sort(key=lambda row: row[0])

    item_ids_set = set()
    result = []

    for row in rows:
        item_id = row[1]
        if item_id not in item_ids_set:
            item_ids_set.add(item_id)
            result.append(item_id)

    logging.info(f"{len(result)} item IDs found")

    return result


def fill_items(app: Flask, item_ids: List[str]) -> None:
    logging.info(f"Filling {len(item_ids)} items")

    fill_properties(
        product_storage=app.container.product_storage(), item_ids=set(item_ids)
    )
    fill_feedback(
        feedback_storage=app.container.feedback_storage(),
        product_storage=app.container.product_storage(),
        item_ids=set(item_ids),
    )


def save_number_of_items(app: Flask, items: int, identifier: str) -> None:
    product_storage = app.container.product_storage()
    feedback_storage = app.container.feedback_storage()
    with open(
        f"../data/test_output/{identifier.replace('.', '')}_{items}.json", mode="a+"
    ) as file:
        json.dump(
            {
                "products": product_storage.count_objects(model_class=ProductModel),
                "product_variants": product_storage.count_objects(
                    model_class=ProductVariantModel
                ),
                "product_variants_in_stock": product_storage.count_objects(
                    model_class=ProductVariantModel, stock_quantity__gt=0
                ),
                "product_detail_enters": feedback_storage.count_objects(
                    model_class=ProductDetailEnterModel
                ),
                "product_add_to_carts": feedback_storage.count_objects(
                    model_class=ProductAddToCartModel
                ),
                "sessions": feedback_storage.count_objects(model_class=SessionModel),
            },
            file,
            indent=4,
        )


def test_performance(app: Flask, items: int, identifier: str) -> None:
    trainer = app.container.trainer()
    result = {}
    for model_class in [
        SimilarityPredictionModel,
        GRU4RecPredictionModel,
        EASEPredictionModel,
    ]:
        trainer.schedule_train(model_name=model_class.Meta.model_name)
        trainer.train()

        statistics = TrainingStatisticsModel.get(
            model_identifier=model_class.get_latest_identifier()
        )

        result[model_class.Meta.model_name] = statistics.dict()

    with open(
        f"../data/test_output/{identifier.replace('.', '')}_{items}_performance.json",
        mode="a+",
    ) as file:
        json.dump(result, file, indent=4)


if __name__ == "__main__":
    identifier = datetime.now().isoformat()

    app = create_app()

    item_ids = get_item_ids()[:LIMIT]

    fill_categories(product_storage=app.container.product_storage())
    fill_types(product_storage=app.container.product_storage())
    fill_items(app=app, item_ids=item_ids)

    save_number_of_items(app=app, items=LIMIT, identifier=identifier)
    test_performance(app=app, items=LIMIT, identifier=identifier)
