from typing import Any, Dict, Optional

from recommender_system.models.stored.model.base import ModelStoredBaseModel


class TrainingStatisticsModel(ModelStoredBaseModel):
    """
    This model represents training statistics as an object that is stored in the database.
    """

    id: Optional[int]
    model_name: str
    model_identifier: str

    duration: float
    peak_memory: float
    peak_memory_percentage: float

    metrics: Dict[str, Any]
    hyperparameters: Dict[str, Any]

    class Meta:
        primary_key = "id"
