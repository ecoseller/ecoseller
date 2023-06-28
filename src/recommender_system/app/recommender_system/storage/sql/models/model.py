from sqlalchemy.sql.schema import Column, Index
from sqlalchemy.sql.sqltypes import Boolean, DECIMAL, JSON, Integer, String, TIMESTAMP
from sqlalchemy.orm import declarative_base, DeclarativeBase

from recommender_system.models.stored.model.config import ConfigModel
from recommender_system.models.stored.model.latest_identifier import (
    LatestIdentifierModel,
)
from recommender_system.models.stored.model.trainer_queue_item import (
    TrainerQueueItemModel,
)
from recommender_system.models.stored.model.training_statistics import (
    TrainingStatisticsModel,
)
from recommender_system.storage.sql.base import SQLModelBase


ModelBase: DeclarativeBase = declarative_base(cls=SQLModelBase)


class SQLConfig(ModelBase):
    """
    This model represents recommender system's configuration table in SQL database.
    """

    id = Column(Integer(), primary_key=True)
    create_at = Column(TIMESTAMP(), nullable=False)
    retrieval_size = Column(Integer(), nullable=False)

    __tablename__ = "config"

    __table_args__ = (Index("config_create_at_idx", create_at),)

    class Meta:
        origin_model = ConfigModel


class SQLLatestIdentifier(ModelBase):
    """
    This model represents the latest model identifier table in SQL database.
    """

    model_name = Column(String(255), primary_key=True)
    identifier = Column(String(255), nullable=False)

    __tablename__ = "latest_identifier"

    class Meta:
        origin_model = LatestIdentifierModel


class SQLTrainerQueueItem(ModelBase):
    """
    This model represents item in queue of models to be trained table in SQL database.
    """

    id = Column(Integer(), primary_key=True)
    model_name = Column(String(255), nullable=False)
    create_at = Column(TIMESTAMP(), nullable=False)
    processed = Column(Boolean(), nullable=False)

    __tablename__ = "trainer_queue"

    __table_args__ = (Index("distance_distance_idx", create_at),)

    class Meta:
        origin_model = TrainerQueueItemModel


class SQLTrainingStatistics(ModelBase):
    """
    This model represents training statistics table in SQL database.
    """

    id = Column(Integer(), primary_key=True)
    model_name = Column(String(255), nullable=False)
    model_identifier = Column(String(255), nullable=False)
    duration = Column(DECIMAL(), nullable=False)
    peak_memory = Column(DECIMAL(), nullable=False)
    peak_memory_percentage = Column(DECIMAL(), nullable=False)
    metrics = Column(JSON(), nullable=False)
    hyperparameters = Column(JSON(), nullable=False)

    __tablename__ = "training_statistics"

    class Meta:
        origin_model = TrainingStatisticsModel


# class SQLPredictionResult(ModelBase):
#     """
#     This model represents training statistics table in SQL database.
#     """
#
#     id = Column(Integer(), primary_key=True)
#     retrieval_model_name = Column(String(255), nullable=False)
#     retrieval_model_identifier = Column(String(255), nullable=False)
#     scoring_model_name = Column(String(255), nullable=False)
#     scoring_model_identifier = Column(String(255), nullable=False)
#     session_id = Column(String(255), nullable=False)
#     retrieval_duration = Column(DECIMAL(), nullable=False)
#     scoring_duration = Column(DECIMAL(), nullable=False)
#     ordering_duration = Column(DECIMAL(), nullable=False)
#     predicted_items = Column(postgresql.ARRAY(String(255)), nullable=False)
#     create_at = Column(TIMESTAMP(), nullable=False)
#
#     __tablename__ = "prediction_result"
#
#     class Meta:
#         origin_model = PredictionResultModel
