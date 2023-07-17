from datetime import datetime, timedelta
from typing import Optional

import pytest

from recommender_system.managers.model_manager import ModelManager
from recommender_system.managers.prediction_pipeline import PredictionPipeline
from recommender_system.models.prediction.abstract import AbstractPredictionModel
from recommender_system.models.prediction.dummy.model import DummyPredictionModel
from recommender_system.models.prediction.ease.model import EASEPredictionModel
from recommender_system.models.prediction.gru4rec.model import GRU4RecPredictionModel
from recommender_system.models.prediction.popularity.model import (
    PopularityPredictionModel,
)
from recommender_system.models.prediction.selection.model import (
    SelectionPredictionModel,
)
from recommender_system.models.stored.feedback.product_detail_enter import (
    ProductDetailEnterModel,
)
from recommender_system.models.stored.feedback.review import ReviewModel
from recommender_system.models.stored.feedback.prediction_result import (
    PredictionResultModel,
)
from recommender_system.models.stored.product.order import OrderModel
from recommender_system.models.stored.product.product import ProductModel
from recommender_system.models.stored.product.product_variant import ProductVariantModel
from recommender_system.utils.recommendation_type import RecommendationType
from tests.storage.tools import get_or_create_model, delete_model, default_dicts


class MockModelManager(ModelManager):
    def __init__(
        self,
        retrieval_model: AbstractPredictionModel,
        scoring_model: AbstractPredictionModel,
    ):
        super().__init__()
        self.retrieval_model = retrieval_model
        self.scoring_model = scoring_model

    def get_model(
        self,
        recommendation_type: RecommendationType,
        step: PredictionPipeline.Step,
        session_id: str,
        user_id: Optional[int],
    ) -> AbstractPredictionModel:
        if step == PredictionPipeline.Step.RETRIEVAL:
            return self.retrieval_model
        else:
            return self.scoring_model


@pytest.fixture
def create_product_variants():
    product = get_or_create_model(model_class=ProductModel)
    data = [
        {
            "sku": "unittest1",
            "ean": "ean",
            "stock_quantity": 1,
            "recommendation_weight": 1.0,
            "create_at": (datetime.now() - timedelta(seconds=2)).isoformat(),
            "update_at": (datetime.now() - timedelta(seconds=2)).isoformat(),
            "product_id": product.pk,
        },
        {
            "sku": "unittest2",
            "ean": "ean",
            "stock_quantity": 2,
            "recommendation_weight": 1.0,
            "create_at": (datetime.now() - timedelta(seconds=1)).isoformat(),
            "update_at": (datetime.now() - timedelta(seconds=1)).isoformat(),
            "product_id": product.pk,
        },
        {
            "sku": "unittest3",
            "ean": "ean",
            "stock_quantity": 3,
            "recommendation_weight": 1.0,
            "create_at": datetime.now().isoformat(),
            "update_at": datetime.now().isoformat(),
            "product_id": product.pk,
        },
        {
            "sku": "unittest4",
            "ean": "ean",
            "stock_quantity": 0,
            "recommendation_weight": 1.0,
            "create_at": datetime.now().isoformat(),
            "update_at": datetime.now().isoformat(),
            "product_id": product.pk,
        },
    ]

    variants = [ProductVariantModel.parse_obj(var) for var in data]
    for variant in variants:
        variant.save()
        product.add_product_variant(variant)

    variants[0].add_order(
        order=OrderModel.parse_obj(default_dicts[OrderModel]), quantity=1
    )

    yield [variant.pk for variant in variants]

    for variant in variants:
        delete_model(model_class=ProductVariantModel, pk=variant.pk)
    delete_model(model_class=ProductModel, pk=product.pk)


@pytest.fixture
def create_product_detail_enters():
    session_id = "unittest"

    variants = [ProductVariantModel.get(pk=f"unittest{i}") for i in range(1, 5)]

    enters = [
        ProductDetailEnterModel(
            session_id=session_id,
            product_id=variant.products[0].id,
            product_variant_sku=variant.sku,
            create_at=datetime.now(),
        )
        for variant in variants
    ]

    for enter in enters:
        enter.create()

    yield session_id

    for enter in enters:
        delete_model(model_class=ProductDetailEnterModel, pk=enter.pk)


@pytest.fixture
def create_product_reviews():
    user_id = 0

    variants = [ProductVariantModel.get(pk=f"unittest{i}") for i in range(1, 5)]

    reviews = [
        ReviewModel(
            id=i,
            session_id=str(user_id),
            user_id=user_id,
            product_id=i,
            product_variant_sku=variant.sku,
            rating=1 + i,
            update_at=datetime.now(),
            create_at=datetime.now(),
        )
        for i, variant in enumerate(variants)
    ]

    for review in reviews:
        delete_model(model_class=ReviewModel, pk=review.pk)
        review.create()

    yield user_id

    for review in reviews:
        delete_model(model_class=ReviewModel, pk=review.pk)


def test_dummy(app, create_product_variants, prediction_pipeline):
    model = DummyPredictionModel()
    with app.container.model_manager.override(
        MockModelManager(retrieval_model=model, scoring_model=model)
    ):
        variant_skus = create_product_variants

        date_from = datetime.now()

        predictions = prediction_pipeline.run(
            recommendation_type=RecommendationType.HOMEPAGE.value,
            session_id="unittest",
            user_id=None,
        )
        predictions = [pred["product_variant_sku"] for pred in predictions]

        for sku in variant_skus:
            if sku == "unittest4":
                assert sku not in predictions
            else:
                assert sku in predictions

        result = PredictionResultModel.get(create_at__gte=date_from)
        assert result.predicted_items == predictions
        assert result.retrieval_model_identifier == model.identifier
        assert result.scoring_model_identifier == model.identifier


def test_popularity(app, create_product_variants, prediction_pipeline):
    model = PopularityPredictionModel()
    with app.container.model_manager.override(
        MockModelManager(retrieval_model=model, scoring_model=model)
    ):
        variant_skus = create_product_variants

        date_from = datetime.now()

        predictions = prediction_pipeline.run(
            recommendation_type=RecommendationType.HOMEPAGE.value,
            session_id="unittest",
            user_id=None,
        )
        predictions = [pred["product_variant_sku"] for pred in predictions]

        for sku in variant_skus:
            if sku == "unittest4":
                assert sku not in predictions
            else:
                assert sku in predictions

        assert len(predictions) == len(ProductVariantModel.gets()) - 1

        result = PredictionResultModel.get(create_at__gte=date_from)
        assert result.predicted_items == predictions
        assert result.retrieval_model_identifier == model.identifier
        assert result.scoring_model_identifier == model.identifier


def test_selection(app, create_product_variants, prediction_pipeline):
    model = SelectionPredictionModel()
    with app.container.model_manager.override(
        MockModelManager(retrieval_model=model, scoring_model=model)
    ):
        variant_skus = create_product_variants

        date_from = datetime.now()

        predictions = prediction_pipeline.run(
            recommendation_type=RecommendationType.HOMEPAGE.value,
            session_id="unittest",
            user_id=None,
        )
        predictions = [pred["product_variant_sku"] for pred in predictions]

        for sku in variant_skus:
            if sku == "unittest4":
                assert sku not in predictions
            else:
                assert sku in predictions

        result = PredictionResultModel.get(create_at__gte=date_from)
        assert result.predicted_items == predictions
        assert result.retrieval_model_identifier == model.identifier
        assert result.scoring_model_identifier == model.identifier


def test_gru4rec(
    app, create_product_variants, create_product_detail_enters, prediction_pipeline
):
    variant_skus = create_product_variants
    session_id = create_product_detail_enters

    dummy = DummyPredictionModel()
    model = GRU4RecPredictionModel()
    model.train()

    try:
        with app.container.model_manager.override(
            MockModelManager(retrieval_model=dummy, scoring_model=model)
        ):
            date_from = datetime.now()

            predictions = prediction_pipeline.run(
                recommendation_type=RecommendationType.HOMEPAGE.value,
                session_id=session_id,
                user_id=None,
            )
            predictions = [pred["product_variant_sku"] for pred in predictions]

            for sku in variant_skus:
                if sku == "unittest4":
                    assert sku not in predictions
                else:
                    assert sku in predictions

            result = PredictionResultModel.get(create_at__gte=date_from)
            assert result.predicted_items == predictions
            assert result.retrieval_model_identifier == dummy.identifier
            assert result.scoring_model_identifier == model.identifier

    finally:
        model.delete()


def test_ease(
    app, create_product_variants, create_product_reviews, prediction_pipeline
):
    variant_skus = create_product_variants
    user_id = create_product_reviews

    dummy = DummyPredictionModel()
    model = EASEPredictionModel()
    model.train()

    try:
        with app.container.model_manager.override(
            MockModelManager(
                retrieval_model=DummyPredictionModel(), scoring_model=model
            )
        ):
            date_from = datetime.now()

            predictions = prediction_pipeline.run(
                recommendation_type=RecommendationType.HOMEPAGE.value,
                session_id=str(user_id),
                user_id=user_id,
            )
            predictions = [pred["product_variant_sku"] for pred in predictions]

            for sku in variant_skus:
                if sku == "unittest4":
                    assert sku not in predictions
                else:
                    assert sku in predictions

            result = PredictionResultModel.get(create_at__gte=date_from)
            assert result.predicted_items == predictions
            assert result.retrieval_model_identifier == dummy.identifier
            assert result.scoring_model_identifier == model.identifier

    finally:
        model.delete()
