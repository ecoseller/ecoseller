from typing import Optional, Dict, Any

from pydantic import Field

from recommender_system.utils.base_model import BaseModel


class Duration(BaseModel):
    avg: Optional[float]
    max: Optional[float]


class PerformanceDataData(BaseModel):
    hit_rate: Optional[float] = Field(
        alias="hitRate",
        title="Hit rate @ %k%",
        description="""How often users click on one of top %k% recommended products.""",
    )
    future_hit_rate: Optional[float] = Field(
        alias="futureHitRate",
        title="Future hit rate @ %k%",
        description="""How often users visit one of top %k% recommended products during the rest of their session.""",
    )
    coverage: Optional[float] = Field(
        alias="coverage",
        title="Coverage",
        description="""What fraction of the product variant catalogue was recommended.""",
    )
    predictions: Optional[int] = Field(alias="predictions")
    retrieval_duration: Duration = Field(alias="retrievalDuration")
    scoring_duration: Duration = Field(alias="scoringDuration")

    @classmethod
    def get_info(cls) -> Dict[str, Any]:
        info_fields_names = ["hit_rate", "future_hit_rate", "coverage"]
        info_fields = [cls.__fields__[name] for name in info_fields_names]
        return {
            field.alias: {
                "title": field.field_info.title,
                "description": field.field_info.description,
            }
            for field in info_fields
        }


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
    duration: Duration


class TrainingData(BaseModel):
    data: TrainingDataData


class Training(BaseModel):
    general: TrainingData
    model_specific: Dict[str, TrainingData] = Field(alias="modelSpecific")
