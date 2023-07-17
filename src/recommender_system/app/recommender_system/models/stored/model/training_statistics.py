from datetime import datetime
from typing import Any, Dict, Optional

from pydantic import Field

from recommender_system.models.stored.model.immutable import ImmutableModelStoredModel


class TrainingStatisticsModel(ImmutableModelStoredModel):
    """
    This model represents training statistics as an object that is stored in the database.
    """

    id: Optional[int]
    model_name: str
    model_identifier: str

    duration: float
    peak_memory: float = Field(alias="peakMemory")
    peak_memory_percentage: float = Field(alias="peakMemoryPercentage")
    full_train: bool = Field(default=True, alias="fullTrain")

    metrics: Dict[str, Any]
    hyperparameters: Dict[str, Any]
    create_at: datetime = datetime.now()

    class Meta:
        primary_key = "id"
