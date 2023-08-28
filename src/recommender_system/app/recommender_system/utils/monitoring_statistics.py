from typing import Optional, Dict

from pydantic import Field

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


class TrainingStatistics(BaseModel):
    started: int
    completed: int
    failed: int


class TrainingMemory(BaseModel):
    avg: Optional[float]
    max: Optional[float]


class TrainingDataData(BaseModel):
    trainings: TrainingStatistics
    peak_memory: TrainingMemory = Field(alias="peakMemory")
    peak_memory_percentage: TrainingMemory = Field(alias="peakMemoryPercentage")


class TrainingData(BaseModel):
    data: TrainingDataData


class Training(BaseModel):
    general: TrainingData
    model_specific: Dict[str, TrainingData] = Field(alias="modelSpecific")
