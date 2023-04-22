from datetime import datetime
from typing import Optional

from recommender_system.models.api.base import ApiBaseModel
from recommender_system.models.stored.product_detail_leave import (
    ProductDetailLeaveModel,
)


class ProductDetailLeave(ApiBaseModel):
    """
    This model represents the event of user leaving product's detail page as
    an object that is sent from core to RS component via API.
    """

    session_id: str
    user_id: Optional[int]
    product_id: int
    product_variant_sku: str
    time_spent: float
    create_at: datetime

    class Meta:
        stored_model_class = ProductDetailLeaveModel
