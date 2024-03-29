from sqlalchemy.dialects import postgresql
from sqlalchemy.sql.schema import Column, Index
from sqlalchemy.sql.sqltypes import (
    Boolean,
    DECIMAL,
    JSON,
    Integer,
    String,
    TIMESTAMP,
    UUID,
)
from sqlalchemy.orm import declarative_base, DeclarativeBase

from recommender_system.models.stored.model.config import ConfigModel
from recommender_system.models.stored.model.latest_identifier import (
    LatestIdentifierModel,
)
from recommender_system.models.stored.model.trainer_queue_item import (
    TrainerQueueItemModel,
)
from recommender_system.models.stored.model.training_finished import (
    TrainingFinishedModel,
)
from recommender_system.models.stored.model.training_started import TrainingStartedModel
from recommender_system.models.stored.model.training_statistics import (
    TrainingStatisticsModel,
)
from recommender_system.models.stored.model.training_step_finished import (
    TrainingStepFinishedModel,
)
from recommender_system.models.stored.model.training_step_started import (
    TrainingStepStartedModel,
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
    ordering_size = Column(Integer(), nullable=False)

    models_disabled = Column(JSON(), nullable=False)

    homepage_retrieval_cascade = Column(
        postgresql.ARRAY(String(255)), nullable=False, default=[]
    )
    homepage_scoring_cascade = Column(
        postgresql.ARRAY(String(255)), nullable=False, default=[]
    )
    category_list_scoring_cascade = Column(
        postgresql.ARRAY(String(255)), nullable=False, default=[]
    )
    product_detail_retrieval_cascade = Column(
        postgresql.ARRAY(String(255)), nullable=False, default=[]
    )
    product_detail_scoring_cascade = Column(
        postgresql.ARRAY(String(255)), nullable=False, default=[]
    )
    cart_retrieval_cascade = Column(
        postgresql.ARRAY(String(255)), nullable=False, default=[]
    )
    cart_scoring_cascade = Column(
        postgresql.ARRAY(String(255)), nullable=False, default=[]
    )

    ease_config = Column(JSON(), nullable=False)
    gru4rec_config = Column(JSON(), nullable=False)
    deleted = Column(Boolean(), nullable=False)

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
    deleted = Column(Boolean(), nullable=False)

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
    deleted = Column(Boolean(), nullable=False)

    __tablename__ = "trainer_queue"

    __table_args__ = (Index("distance_distance_idx", create_at),)

    class Meta:
        origin_model = TrainerQueueItemModel


class SQLTrainingFinished(ModelBase):
    """
    This model represents training finished event table in SQL database.
    """

    training_id = Column(UUID(as_uuid=True), primary_key=True)
    create_at = Column(TIMESTAMP(), nullable=False)
    deleted = Column(Boolean(), nullable=False)

    __tablename__ = "training_finished"

    class Meta:
        origin_model = TrainingFinishedModel


class SQLTrainingStarted(ModelBase):
    """
    This model represents training started event table in SQL database.
    """

    training_id = Column(UUID(as_uuid=True), primary_key=True)
    model_name = Column(String(255), nullable=False)
    model_identifier = Column(String(255), nullable=False)
    create_at = Column(TIMESTAMP(), nullable=False)
    deleted = Column(Boolean(), nullable=False)

    __tablename__ = "training_started"

    class Meta:
        origin_model = TrainingStartedModel


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
    full_train = Column(Boolean(), nullable=False, default=True)
    metrics = Column(JSON(), nullable=False)
    hyperparameters = Column(JSON(), nullable=False)
    create_at = Column(TIMESTAMP(), nullable=False)
    deleted = Column(Boolean(), nullable=False)

    __tablename__ = "training_statistics"

    class Meta:
        origin_model = TrainingStatisticsModel


class SQLTrainingStepFinished(ModelBase):
    """
    This model represents training step finished event table in SQL database.
    """

    step_id = Column(UUID(as_uuid=True), primary_key=True)
    model_name = Column(String(255), nullable=False)
    model_identifier = Column(String(255), nullable=False)
    metrics = Column(JSON(), nullable=False)
    create_at = Column(TIMESTAMP(), nullable=False)
    deleted = Column(Boolean(), nullable=False)

    __tablename__ = "training_step_finished"

    class Meta:
        origin_model = TrainingStepFinishedModel


class SQLTrainingStepStarted(ModelBase):
    """
    This model represents training step started event table in SQL database.
    """

    step_id = Column(UUID(as_uuid=True), primary_key=True)
    training_id = Column(UUID(as_uuid=True), nullable=False)
    model_name = Column(String(255), nullable=False)
    model_identifier = Column(String(255), nullable=False)
    hyperparameters = Column(JSON(), nullable=False)
    create_at = Column(TIMESTAMP(), nullable=False)
    deleted = Column(Boolean(), nullable=False)

    __tablename__ = "training_step_started"

    class Meta:
        origin_model = TrainingStepStartedModel
