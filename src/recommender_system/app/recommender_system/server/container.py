import os

from dependency_injector import containers, providers

from recommender_system.managers.cache_manager import CacheManager
from recommender_system.managers.data_manager import DataManager
from recommender_system.managers.model_manager import ModelManager
from recommender_system.managers.monitoring_manager import MonitoringManager
from recommender_system.managers.prediction_pipeline import PredictionPipeline
from recommender_system.managers.request_manager import RequestManager
from recommender_system.managers.trainer import Trainer
from recommender_system.storage.cache.storage import FileCacheStorage
from recommender_system.storage.feedback.storage import SQLFeedbackStorage
from recommender_system.storage.ease.storage import FileEASEStorage
from recommender_system.storage.gru4rec.storage import FileGRU4RecStorage
from recommender_system.storage.model.storage import SQLModelStorage
from recommender_system.storage.product.storage import SQLProductStorage
from recommender_system.storage.similarity.storage import SQLSimilarityStorage


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

    cache_storage = providers.Singleton(
        FileCacheStorage,
        directory=os.path.join("data", "cache"),
        size=int(os.environ.get("RS_CACHE_SIZE", "1000")),
    )
    feedback_storage = providers.Singleton(
        SQLFeedbackStorage,
        connection_string=os.environ["RS_FEEDBACK_DB_URL"],
        alembic_location="recommender_system/storage/feedback/alembic.ini",
    )
    ease_storage = providers.Singleton(
        FileEASEStorage, directory=os.path.join("data", "ease")
    )
    gru4rec_storage = providers.Singleton(
        FileGRU4RecStorage, directory=os.path.join("data", "gru4rec")
    )
    model_storage = providers.Singleton(
        SQLModelStorage,
        connection_string=os.environ["RS_MODEL_DB_URL"],
        alembic_location="recommender_system/storage/model/alembic.ini",
    )
    product_storage = providers.Singleton(
        SQLProductStorage,
        connection_string=os.environ["RS_PRODUCT_DB_URL"],
        alembic_location="recommender_system/storage/product/alembic.ini",
    )
    similarity_storage = providers.Singleton(
        SQLSimilarityStorage,
        connection_string=os.environ["RS_SIMILARITY_DB_URL"],
        alembic_location="recommender_system/storage/similarity/alembic.ini",
    )
