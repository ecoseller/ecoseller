from typing import List, Optional, Dict

from pydantic import Field

from recommender_system.models.stored.model.training_statistics import (
    TrainingStatisticsModel,
)
from recommender_system.utils.base_model import BaseModel


class PerformanceDuration(BaseModel):
    avg: Optional[float]
    max: Optional[float]


class PerformanceDataData(BaseModel):
    hit_rate: Optional[float] = Field(alias="hitRate")
    future_hit_rate: Optional[float] = Field(alias="futureHitRate")
    coverage: Optional[float] = Field(alias="coverage")
    predictions: Optional[int] = Field(alias="predictions")
    retrieval_duration: PerformanceDuration = Field(alias="retrievalDuration")
    scoring_duration: PerformanceDuration = Field(alias="scoringDuration")


class PerformanceData(BaseModel):
    k: int
    data: PerformanceDataData


class Performance(BaseModel):
    general: PerformanceData
    model_specific: Dict[str, PerformanceData] = Field(alias="modelSpecific")


class ModelTrainingDetails(BaseModel):
    model_name: str = Field(alias="name")
    statistics: Optional[TrainingStatisticsModel]


class TrainingDetails(BaseModel):
    models: List[ModelTrainingDetails]
