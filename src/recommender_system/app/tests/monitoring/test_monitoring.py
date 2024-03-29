from datetime import datetime, timedelta

from dependency_injector.wiring import inject, Provide
import pytest

from recommender_system.managers.monitoring_manager import MonitoringManager
from recommender_system.models.stored.feedback.prediction_result import (
    PredictionResultModel,
)
from recommender_system.models.stored.feedback.product_detail_enter import (
    ProductDetailEnterModel,
)
from recommender_system.models.stored.product.product_variant import ProductVariantModel
from recommender_system.utils.recommendation_type import RecommendationType
from tests.storage.tools import delete_model


@pytest.fixture
def prepare_data():
    for variant in ProductVariantModel.gets():
        variant.delete()
    for result in PredictionResultModel.gets():
        delete_model(model_class=PredictionResultModel, pk=result.pk)
    for enter in ProductDetailEnterModel.gets():
        delete_model(model_class=ProductDetailEnterModel, pk=enter.pk)

    variants = [
        ProductVariantModel(
            sku=str(i),
            ean=str(i),
            weight=1.0,
            stock_quantity=1,
            recommendation_weight=1.0,
            update_at=datetime.now(),
            create_at=datetime.now(),
        )
        for i in range(4)
    ]
    for variant in variants:
        variant.create()

    results = [
        PredictionResultModel(
            retrieval_model_name="selection",
            retrieval_model_identifier="selection",
            scoring_model_name="similarity",
            scoring_model_identifier="similarity",
            recommendation_type=RecommendationType.CART.value,
            session_id="1",
            retrieval_duration=1.0,
            scoring_duration=1.0,
            ordering_duration=1.0,
            predicted_items=["1", "2"],
            create_at=datetime.now() - timedelta(seconds=1),
        ),
        PredictionResultModel(
            retrieval_model_name="selection",
            retrieval_model_identifier="selection",
            scoring_model_name="similarity",
            scoring_model_identifier="similarity",
            recommendation_type=RecommendationType.CART.value,
            session_id="1",
            retrieval_duration=1.0,
            scoring_duration=1.0,
            ordering_duration=1.0,
            predicted_items=["2", "3"],
            create_at=datetime.now() - timedelta(seconds=1),
        ),
        PredictionResultModel(
            retrieval_model_name="similarity",
            retrieval_model_identifier="similarity",
            scoring_model_name="selection",
            scoring_model_identifier="selection",
            recommendation_type=RecommendationType.PRODUCT_DETAIL.value,
            session_id="1",
            retrieval_duration=1.0,
            scoring_duration=1.0,
            ordering_duration=1.0,
            predicted_items=["1", "2"],
            create_at=datetime.now() - timedelta(seconds=1),
        ),
        PredictionResultModel(
            retrieval_model_name="similarity",
            retrieval_model_identifier="similarity",
            scoring_model_name="similarity",
            scoring_model_identifier="similarity",
            recommendation_type=RecommendationType.PRODUCT_DETAIL.value,
            session_id="2",
            retrieval_duration=1.0,
            scoring_duration=1.0,
            ordering_duration=1.0,
            predicted_items=["3"],
            create_at=datetime.now() - timedelta(seconds=1),
        ),
    ]
    for result in results:
        result.create()

    enters = [
        ProductDetailEnterModel(
            session_id="1",
            product_id=1,
            product_variant_sku="1",
            recommendation_type=RecommendationType.CART.value,
            model_identifier="similarity",
            model_name="similarity",
            position=0,
            create_at=datetime.now(),
        ),
        ProductDetailEnterModel(
            session_id="2",
            product_id=1,
            product_variant_sku="2",
            create_at=datetime.now(),
        ),
        ProductDetailEnterModel(
            session_id="2",
            product_id=1,
            product_variant_sku="1",
            recommendation_type=RecommendationType.PRODUCT_DETAIL.value,
            model_identifier="similarity",
            model_name="similarity",
            position=0,
            create_at=datetime.now(),
        ),
    ]
    for enter in enters:
        enter.create()

    yield

    for variant in ProductVariantModel.gets():
        variant.delete()
    for result in PredictionResultModel.gets():
        delete_model(model_class=PredictionResultModel, pk=result.pk)
    for enter in ProductDetailEnterModel.gets():
        delete_model(model_class=ProductDetailEnterModel, pk=enter.pk)


@inject
def test_statistics(
    prepare_data, monitoring_manager: MonitoringManager = Provide["monitoring_manager"]
):
    date_from = datetime.now() - timedelta(seconds=2)
    _ = prepare_data

    statistics = monitoring_manager.get_performance(
        date_from=date_from, date_to=datetime.now()
    )

    assert statistics.general.data.coverage == 3 / 4
    assert statistics.general.data.hit_rate == 2 / 4
    assert statistics.general.data.future_hit_rate == 1 / 4

    similarity = statistics.model_specific["similarity"].data
    assert similarity.coverage == 3 / 4
    assert similarity.hit_rate == 2 / 3
    assert similarity.future_hit_rate == 1 / 3
