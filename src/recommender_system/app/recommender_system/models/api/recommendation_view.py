from datetime import datetime
from typing import Optional

from recommender_system.models.api.base import ApiBaseModel
from recommender_system.models.stored.feedback.recommendation_view import (
    RecommendationViewModel,
)


class RecommendationView(ApiBaseModel):
    """
    This model represents the event of user viewing a recommended product
    (appearing on screen) as an object that is sent from core to RS component
    via API.
    """

    session_id: str
    user_id: Optional[int]
    product_id: int
    product_variant_sku: str
    recommendation_type: str
    model_identifier: str
    position: Optional[int]
    create_at: datetime

    class Meta:
        stored_model_class = RecommendationViewModel
