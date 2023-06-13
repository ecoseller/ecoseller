import logging
import time
from typing import Type

from recommender_system.models.prediction.abstract import AbstractPredictionModel
from recommender_system.models.prediction.dummy.model import DummyPredictionModel
from recommender_system.models.prediction.selection.model import (
    SelectionPredictionModel,
)
from recommender_system.models.prediction.popularity.model import (
    PopularityPredictionModel,
)
from recommender_system.models.stored.product.product_variant import ProductVariantModel
from recommender_system.server.app import create_app


def test_model_performance(model_class: Type[AbstractPredictionModel]) -> None:
    logging.info(f"Testing performance of model {model_class.__name__}")

    start = time.time()
    result = model_class().predict(session_id="session_id", user_id=None)
    end = time.time()

    logging.info(f"Prediction finished in {end - start:.4f} seconds")
    logging.info(f"{len(result)} product variants returned")


if __name__ == "__main__":
    app = create_app()
    product_variants = app.container.product_storage().count_objects(
        model_class=ProductVariantModel
    )

    logging.info(
        f"Testing performance with {product_variants:,} product variants in the database"
    )

    test_model_performance(model_class=DummyPredictionModel)
    test_model_performance(model_class=SelectionPredictionModel)
    test_model_performance(model_class=PopularityPredictionModel)
