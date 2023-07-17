import logging
from datetime import datetime
from typing import Any, Tuple

from dependency_injector.wiring import inject, Provide
from flask import request

from recommender_system.managers.data_manager import DataManager
from recommender_system.managers.model_manager import ModelManager
from recommender_system.managers.monitoring_manager import MonitoringManager
from recommender_system.managers.prediction_pipeline import PredictionPipeline


def view_healthcheck() -> Tuple[Any, ...]:
    return "", 200


@inject
def view_store_object(
    data_manager: DataManager = Provide["data_manager"],
) -> Tuple[Any, ...]:
    logging.info(f"Storing object {request.json}")
    data_manager.store_object(data=request.json)
    return "", 200


@inject
def view_store_objects(
    data_manager: DataManager = Provide["data_manager"],
) -> Tuple[Any, ...]:
    logging.info(f"Storing objects {request.json}")
    data_manager.store_objects(data=request.json)
    return "", 200


@inject
def view_predict(
    prediction_pipeline: PredictionPipeline = Provide["prediction_pipeline"],
) -> Tuple[Any, ...]:
    data = request.json
    logging.info(f"Recommending for {data}")
    predictions = prediction_pipeline.run(**data)
    return predictions, 200


@inject
def view_predict_product_positions(
    prediction_pipeline: PredictionPipeline = Provide["prediction_pipeline"],
) -> Tuple[Any, ...]:
    data = request.json
    logging.info(f"Recommending product positions for {data}")
    predictions = prediction_pipeline.get_product_positions(**data)
    return predictions, 200


@inject
def view_get_dashboard_data(
    model_manager: ModelManager = Provide["model_manager"],
    monitoring_manager: MonitoringManager = Provide["monitoring_manager"],
) -> Tuple[Any, ...]:
    date_from = datetime.strptime(request.args["date_from"], "%Y-%m-%dT%H:%M:%S.%fZ")
    date_to = datetime.strptime(request.args["date_to"], "%Y-%m-%dT%H:%M:%S.%fZ")
    result = {
        "models": [
            {"name": model.Meta.model_name, "title": model.Meta.title}
            for model in model_manager.get_all_models()
        ],
        "performance": monitoring_manager.get_statistics(
            date_from=date_from, date_to=date_to
        ).dict(by_alias=True),
        "training": monitoring_manager.get_training_details().dict(by_alias=True),
        "config": monitoring_manager.get_config().dict(
            by_alias=True, exclude={"create_at", "id"}
        ),
    }
    return result, 200
