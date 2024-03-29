from datetime import datetime
from typing import Optional

from recommender_system.models.api.immutable import ImmutableApiModel
from recommender_system.models.stored.feedback.product_add_to_cart import (
    ProductAddToCartModel,
)


class ProductAddToCart(ImmutableApiModel):
    """
    This model represents the event of user adding a product to cart as an
    object that is sent from core to RS component via API.
    """

    session_id: str
    user_id: Optional[int]
    product_id: int
    product_variant_sku: str
    create_at: datetime = datetime.now()

    class Meta:
        stored_model_class = ProductAddToCartModel
