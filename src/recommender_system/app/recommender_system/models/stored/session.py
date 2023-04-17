from typing import Optional

from recommender_system.models.stored.immutable import ImmutableFeedbackStoredModel


class SessionModel(ImmutableFeedbackStoredModel):
    """
    This model represents session as an object that is stored in the database.
    """

    id: str
    user_id: Optional[int]

    class Meta:
        primary_key = "id"
