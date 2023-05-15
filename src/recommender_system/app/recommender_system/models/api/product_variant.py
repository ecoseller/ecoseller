from datetime import datetime
from typing import List, Optional

from recommender_system.models.api.base import ApiBaseModel
from recommender_system.models.stored.product.product_variant import ProductVariantModel


class ProductVariant(ApiBaseModel):
    """
    This model represents product variant as an object that is sent from core
    to RS component via API.
    """

    sku: str
    ean: str
    weight: Optional[float]
    recommendation_weight: float
    update_at: datetime
    create_at: datetime
    attributes: List[int]

    class Meta:
        stored_model_class = ProductVariantModel
