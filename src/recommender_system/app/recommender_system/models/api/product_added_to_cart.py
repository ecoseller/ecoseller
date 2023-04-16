from datetime import datetime
from typing import Optional

from recommender_system.models.api.base import ApiBaseModel


class ProductAddedToCart(ApiBaseModel):
    """
    This model represents the event of user adding a product to cart as an
    object that is sent from core to RS component via API.
    """

    session_id: str
    user_id: Optional[int]
    product_id: int
    create_at: datetime
