from datetime import datetime
from typing import Optional

from recommender_system.models.api.immutable import ImmutableApiModel
from recommender_system.models.stored.feedback.product_detail_leave import (
    ProductDetailLeaveModel,
)


class ProductDetailLeave(ImmutableApiModel):
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
