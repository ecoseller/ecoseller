from datetime import datetime
from typing import Optional

from recommender_system.models.stored.base import StoredBaseModel


class RecommendationViewModel(StoredBaseModel):
    """
    This model represents the event of user viewing a recommended product
    (appearing on screen) as an object that is stored in the database.
    """

    session_id: str
    user_id: Optional[int]
    product_id: int
    recommendation_type: str
    position: Optional[int]
    create_at: datetime
