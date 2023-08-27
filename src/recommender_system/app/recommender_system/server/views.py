import json
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
    logging.info(f"Storing object {json.dumps(request.json, indent=4)}")
    data_manager.store_object(data=request.json)
    return "", 200


@inject
def view_store_objects(
    data_manager: DataManager = Provide["data_manager"],
) -> Tuple[Any, ...]:
    logging.info(f"Storing objects {json.dumps(request.json, indent=4)}")
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
def view_get_dashboard_configuration(
    model_manager: ModelManager = Provide["model_manager"],
) -> Tuple[Any, ...]:
    result = {
        "models": model_manager.get_all_models_dicts(),
        "config": model_manager.config.dict(
            by_alias=True, exclude={"create_at", "id"}, exclude_models=False
        ),
        "info": model_manager.config.info,
    }
    return result, 200


@inject
def view_get_dashboard_performance(
    model_manager: ModelManager = Provide["model_manager"],
    monitoring_manager: MonitoringManager = Provide["monitoring_manager"],
) -> Tuple[Any, ...]:
    date_from = datetime.strptime(request.args["date_from"], "%Y-%m-%dT%H:%M:%S.%fZ")
    date_to = datetime.strptime(request.args["date_to"], "%Y-%m-%dT%H:%M:%S.%fZ")
    result = {
        "models": model_manager.get_all_models_dicts(),
        "performance": monitoring_manager.get_performance(
            date_from=date_from, date_to=date_to
        ).dict(by_alias=True),
    }
    return result, 200


@inject
def view_get_dashboard_training(
    model_manager: ModelManager = Provide["model_manager"],
    monitoring_manager: MonitoringManager = Provide["monitoring_manager"],
) -> Tuple[Any, ...]:
    date_from = datetime.strptime(request.args["date_from"], "%Y-%m-%dT%H:%M:%S.%fZ")
    date_to = datetime.strptime(request.args["date_to"], "%Y-%m-%dT%H:%M:%S.%fZ")
    result = {
        "models": model_manager.get_all_models_dicts(),
        "training": monitoring_manager.get_training_details(
            date_from=date_from, date_to=date_to
        ).dict(by_alias=True),
    }
    return result, 200
