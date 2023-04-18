import os

from dependency_injector import containers, providers

from recommender_system.managers.cache_manager import CacheManager
from recommender_system.managers.data_manager import DataManager
from recommender_system.managers.model_manager import ModelManager
from recommender_system.managers.monitoring_manager import MonitoringManager
from recommender_system.managers.prediction_pipeline import PredictionPipeline
from recommender_system.managers.request_manager import RequestManager
from recommender_system.managers.trainer import Trainer
from recommender_system.storage.sql.storage import SQLStorage


class Container(containers.DeclarativeContainer):
    wiring_config = containers.WiringConfiguration(
        packages=["recommender_system"], auto_wire=False
    )

    cache_manager = providers.Singleton(CacheManager)
    data_manager = providers.Singleton(DataManager)
    model_manager = providers.Singleton(ModelManager)
    monitoring_manager = providers.Singleton(MonitoringManager)
    prediction_pipeline = providers.Singleton(PredictionPipeline)
    request_manager = providers.Singleton(RequestManager)
    trainer = providers.Singleton(Trainer)

    feedback_storage = providers.Singleton(
        SQLStorage,
        connection_string=os.environ["RS_FEEDBACK_DB_URL"],
        alembic_location="recommender_system/storage/feedback/alembic.ini",
    )
    product_storage = providers.Singleton(
        SQLStorage,
        connection_string=os.environ["RS_PRODUCT_DB_URL"],
        alembic_location="recommender_system/storage/product/alembic.ini",
    )
