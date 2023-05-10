from typing import Any, Tuple

from dependency_injector.wiring import inject, Provide
from flask import request

from recommender_system.managers.data_manager import DataManager
from recommender_system.managers.prediction_pipeline import PredictionPipeline
from recommender_system.utils.recommendation_type import RecommendationType


def view_healthcheck() -> Tuple[Any, ...]:
    return "", 200


@inject
def view_store_object(
    data_manager: DataManager = Provide["data_manager"],
) -> Tuple[Any, ...]:
    data_manager.store_object(data=request.json)
    return "", 200


@inject
def view_predict_homepage(
    prediction_pipeline: PredictionPipeline = Provide["prediction_pipeline"],
) -> Tuple[Any, ...]:
    data = request.json
    predictions = prediction_pipeline.run(
        recommendation_type=RecommendationType.HOMEPAGE,
        session_id=data["session_id"],
        user_id=data["user_id"],
    )
    return predictions, 200


@inject
def view_predict_category_list(
    prediction_pipeline: PredictionPipeline = Provide["prediction_pipeline"],
) -> Tuple[Any, ...]:
    data = request.json
    predictions = prediction_pipeline.run(
        recommendation_type=RecommendationType.CATEGORY_LIST,
        session_id=data["session_id"],
        user_id=data["user_id"],
    )
    return predictions, 200


@inject
def view_predict_product_detail(
    prediction_pipeline: PredictionPipeline = Provide["prediction_pipeline"],
) -> Tuple[Any, ...]:
    data = request.json
    predictions = prediction_pipeline.run(
        recommendation_type=RecommendationType.PRODUCT_DETAIL,
        session_id=data["session_id"],
        user_id=data["user_id"],
    )
    return predictions, 200


@inject
def view_predict_cart(
    prediction_pipeline: PredictionPipeline = Provide["prediction_pipeline"],
) -> Tuple[Any, ...]:
    data = request.json
    predictions = prediction_pipeline.run(
        recommendation_type=RecommendationType.CART,
        session_id=data["session_id"],
        user_id=data["user_id"],
    )
    return predictions, 200
