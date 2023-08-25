from typing import List, Optional

from pydantic import Field

from recommender_system.models.stored.model.training_statistics import (
    TrainingStatisticsModel,
)
from recommender_system.utils.base_model import BaseModel


class StatisticsItem(BaseModel):
    k: int
    direct_hit: Optional[float] = Field(alias="directHit")
    future_hit: Optional[float] = Field(alias="futureHit")
    coverage: Optional[float]


class TypeStatistics(BaseModel):
    recommendation_type: str = Field(alias="name")
    recommendation_type_title: str = Field(alias="title")
    item: StatisticsItem


class ModelStatistics(BaseModel):
    model_name: str = Field(alias="name")
    item: StatisticsItem
    types: List[TypeStatistics]


class Statistics(BaseModel):
    item: StatisticsItem
    models: List[ModelStatistics]


class ModelTrainingDetails(BaseModel):
    model_name: str = Field(alias="name")
    statistics: Optional[TrainingStatisticsModel]


class TrainingDetails(BaseModel):
    models: List[ModelTrainingDetails]
