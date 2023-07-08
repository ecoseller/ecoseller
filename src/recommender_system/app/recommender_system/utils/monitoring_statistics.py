from typing import List, Optional

from pydantic import BaseModel

from recommender_system.models.stored.model.training_statistics import (
    TrainingStatisticsModel,
)


class StatisticsItem(BaseModel):
    direct_hit: Optional[float]
    future_hit: Optional[float]
    coverage: Optional[float]


class TypeStatistics(BaseModel):
    recommendation_type: str
    item: StatisticsItem


class ModelStatistics(BaseModel):
    model_name: str
    item: StatisticsItem
    types: List[TypeStatistics]


class Statistics(BaseModel):
    k: int
    item: StatisticsItem
    models: List[ModelStatistics]
    # TODO: Add usage


class ModelTrainingDetails(BaseModel):
    model_name: str
    statistics: Optional[TrainingStatisticsModel]


class TrainingDetails(BaseModel):
    models: List[ModelTrainingDetails]
