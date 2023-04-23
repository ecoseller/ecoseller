from datetime import datetime, timedelta

import pytest

from recommender_system.managers.model_manager import ModelManager
from recommender_system.managers.prediction_pipeline import PredictionPipeline
from recommender_system.models.prediction.abstract import AbstractPredictionModel
from recommender_system.models.prediction.dummy.model import DummyPredictionModel
from recommender_system.models.prediction.popularity.model import (
    PopularityPredictionModel,
)
from recommender_system.models.prediction.selection.model import (
    SelectionPredictionModel,
)
from recommender_system.models.stored.order import OrderModel
from recommender_system.models.stored.product import ProductModel
from recommender_system.models.stored.product_variant import ProductVariantModel
from recommender_system.utils.recommendation_type import RecommendationType
from tests.storage.tools import get_or_create_model, delete_model, default_dicts


class MockModelManager(ModelManager):
    def __init__(self, model: AbstractPredictionModel):
        super().__init__()
        self.model = model

    def get_model(
        self, recommendation_type: RecommendationType, step: PredictionPipeline.Step
    ) -> AbstractPredictionModel:
        return self.model


@pytest.fixture
def create_product_variants():
    product = get_or_create_model(model_class=ProductModel)
    data = [
        {
            "sku": "unittest1",
            "ean": "ean",
            "recommendation_weight": 1.0,
            "create_at": (datetime.now() - timedelta(seconds=2)).isoformat(),
            "update_at": (datetime.now() - timedelta(seconds=2)).isoformat(),
            "product_id": product.pk,
        },
        {
            "sku": "unittest2",
            "ean": "ean",
            "recommendation_weight": 1.0,
            "create_at": (datetime.now() - timedelta(seconds=1)).isoformat(),
            "update_at": (datetime.now() - timedelta(seconds=1)).isoformat(),
            "product_id": product.pk,
        },
        {
            "sku": "unittest3",
            "ean": "ean",
            "recommendation_weight": 1.0,
            "create_at": datetime.now().isoformat(),
            "update_at": datetime.now().isoformat(),
            "product_id": product.pk,
        },
    ]

    variants = [ProductVariantModel.parse_obj(var) for var in data]
    for variant in variants:
        variant.save()

    variants[0].add_order(
        order=OrderModel.parse_obj(default_dicts[OrderModel]), amount=1
    )

    yield [variant.pk for variant in variants]

    for variant in variants:
        delete_model(model_class=ProductVariantModel, pk=variant.pk)
    delete_model(model_class=ProductModel, pk=product.pk)


def test_dummy(app, create_product_variants, prediction_pipeline):
    with app.container.model_manager.override(
        MockModelManager(model=DummyPredictionModel())
    ):
        variant_skus = create_product_variants

        predictions = prediction_pipeline.run(
            recommendation_type=RecommendationType.HOMEPAGE,
            session_id="unittest",
            user_id=None,
        )

        for sku in variant_skus:
            assert sku in predictions

        variants = [ProductVariantModel.get(pk=sku) for sku in variant_skus]
        variants.sort(key=lambda variant: variant.create_at, reverse=True)

        ordered_skus = [variant.sku for variant in variants]

        indices = [predictions.index(sku) for sku in ordered_skus]
        index = -1
        for found_index in indices:
            assert index < found_index
            index = found_index


def test_popularity(app, create_product_variants, prediction_pipeline):
    with app.container.model_manager.override(
        MockModelManager(model=PopularityPredictionModel())
    ):
        variant_skus = create_product_variants

        predictions = prediction_pipeline.run(
            recommendation_type=RecommendationType.HOMEPAGE,
            session_id="unittest",
            user_id=None,
        )

        for sku in variant_skus:
            assert sku in predictions

        assert len(predictions) == len(ProductVariantModel.gets())


def test_selection(app, create_product_variants, prediction_pipeline):
    with app.container.model_manager.override(
        MockModelManager(model=SelectionPredictionModel())
    ):
        variant_skus = create_product_variants

        predictions = prediction_pipeline.run(
            recommendation_type=RecommendationType.HOMEPAGE,
            session_id="unittest",
            user_id=None,
        )

        for sku in variant_skus:
            assert sku in predictions
