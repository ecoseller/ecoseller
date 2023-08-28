from datetime import datetime
from typing import Any, Dict
from uuid import uuid4, UUID

from pydantic import Field

from recommender_system.models.stored.model.immutable import ImmutableModelStoredModel


class TrainingStepStartedModel(ImmutableModelStoredModel):
    """
    This model represents training step started event as an object that is stored in the database.
    """

    step_id: UUID = Field(default_factory=uuid4)
    training_id: UUID
    model_name: str
    model_identifier: str

    hyperparameters: Dict[str, Any]
    create_at: datetime = datetime.now()

    class Meta:
        primary_key = "step_id"
