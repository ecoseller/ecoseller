from datetime import datetime
from typing import Optional

from recommender_system.models.api.base import ApiBaseModel


class ProductDetailLeave(ApiBaseModel):
    """
    This model represents the event of user leaving product's detail page as
    an object that is sent from core to RS component via API.
    """

    session_id: str
    user_id: Optional[int]
    product_id: int
    time_spent: float
    create_at: datetime
