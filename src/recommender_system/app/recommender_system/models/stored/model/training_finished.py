from datetime import datetime
from uuid import UUID

from recommender_system.models.stored.model.immutable import ImmutableModelStoredModel


class TrainingFinishedModel(ImmutableModelStoredModel):
    """
    This model represents training finished event as an object that is stored in the database.
    """

    training_id: UUID
    create_at: datetime = datetime.now()

    class Meta:
        primary_key = "training_id"
