from datetime import datetime
from typing import Optional

from recommender_system.models.api.base import ApiBaseModel


class ProductDetailEnter(ApiBaseModel):
    """
    This model represents the event of user viewing a possibly recommended
    product's detail (clicking a product) as an object that is sent from core
    to RS component via API.
    """

    session_id: str
    user_id: Optional[int]
    product_id: int
    product_variant_sku: str
    recommendation_type: Optional[str]
    position: Optional[int]
    create_at: datetime
