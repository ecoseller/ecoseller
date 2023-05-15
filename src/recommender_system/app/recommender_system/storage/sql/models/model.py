from sqlalchemy.sql.schema import Column, Index
from sqlalchemy.sql.sqltypes import Boolean, Integer, String, TIMESTAMP
from sqlalchemy.orm import declarative_base, DeclarativeBase

from recommender_system.models.stored.model.latest_identifier import (
    LatestIdentifierModel,
)
from recommender_system.models.stored.model.trainer_queue_item import (
    TrainerQueueItemModel,
)
from recommender_system.storage.sql.base import SQLModelBase


ModelBase: DeclarativeBase = declarative_base(cls=SQLModelBase)


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
    This model represents queue of models to be trained table in SQL database.
    """

    id = Column(Integer(), primary_key=True)
    model_name = Column(String(255), nullable=False)
    create_at = Column(TIMESTAMP(), nullable=False)
    processed = Column(Boolean(), nullable=False)

    __tablename__ = "trainer_queue"

    __table_args__ = (Index("distance_distance_idx", create_at),)

    class Meta:
        origin_model = TrainerQueueItemModel
