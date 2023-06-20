from typing import List, Optional

from recommender_system.models.stored.feedback.base import (
    FeedbackStoredBaseModel,
)


class SessionModel(FeedbackStoredBaseModel):
    """
    This model represents session as an object that is stored in the database.
    """

    id: str
    user_id: Optional[int]
    visited_product_variants: List[str] = []

    class Meta:
        primary_key = "id"
