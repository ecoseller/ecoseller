from datetime import datetime
from typing import List, Optional

from recommender_system.models.stored.feedback.immutable import (
    ImmutableFeedbackStoredModel,
)


class PredictionResultModel(ImmutableFeedbackStoredModel):
    """
    This model represents prediction result as an object that is stored in the database.
    """

    id: Optional[int]
    retrieval_model_name: str
    retrieval_model_identifier: str
    scoring_model_name: str
    scoring_model_identifier: str
    recommendation_type: str
    session_id: str

    retrieval_duration: float
    scoring_duration: float
    ordering_duration: float

    predicted_items: List[str]

    create_at: datetime

    class Meta:
        primary_key = "id"
