import os

from dependency_injector import containers, providers

from managers.cache_manager import CacheManager
from managers.data_manager import DataManager
from managers.model_manager import ModelManager
from managers.monitoring_manager import MonitoringManager
from managers.prediction_pipeline import PredictionPipeline
from managers.request_manager import RequestManager
from managers.trainer import Trainer
from storage.sqlite.storage import SqliteStorage


class Container(containers.DeclarativeContainer):
    cache_manager = providers.Singleton(CacheManager)
    data_manager = providers.Singleton(DataManager)
    model_manager = providers.Singleton(ModelManager)
    monitoring_manager = providers.Singleton(MonitoringManager)
    prediction_pipeline = providers.Singleton(PredictionPipeline)
    request_manager = providers.Singleton(RequestManager)
    trainer = providers.Singleton(Trainer)

    storage = providers.Singleton(
        SqliteStorage, connection_string=os.environ["RS_DB_URL"]
    )
