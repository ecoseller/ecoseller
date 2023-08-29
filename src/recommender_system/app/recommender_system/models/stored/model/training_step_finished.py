from datetime import datetime
from typing import Any, Dict
from uuid import UUID

from recommender_system.models.stored.model.immutable import ImmutableModelStoredModel


class TrainingStepFinishedModel(ImmutableModelStoredModel):
    """
    This model represents training step finished event as an object that is stored in the database.
    """

    step_id: UUID
    model_name: str
    model_identifier: str

    metrics: Dict[str, Any]
    create_at: datetime = datetime.now()

    class Meta:
        primary_key = "step_id"
