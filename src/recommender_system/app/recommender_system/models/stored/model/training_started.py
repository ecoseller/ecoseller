from datetime import datetime
from uuid import uuid4, UUID

from pydantic import Field

from recommender_system.models.stored.model.immutable import ImmutableModelStoredModel


class TrainingStartedModel(ImmutableModelStoredModel):
    """
    This model represents training started event as an object that is stored in the database.
    """

    training_id: UUID = Field(default_factory=uuid4)
    model_name: str
    model_identifier: str
    create_at: datetime = datetime.now()

    class Meta:
        primary_key = "training_id"
