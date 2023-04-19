from datetime import datetime
from typing import List, Optional

from recommender_system.models.api.attribute import Attribute
from recommender_system.models.api.base import ApiBaseModel
from recommender_system.models.stored.product_variant import ProductVariantModel


class ProductVariant(ApiBaseModel):
    """
    This model represents product variant as an object that is sent from core
    to RS component via API.
    """

    sku: str
    ean: str
    weight: Optional[float]
    update_at: datetime
    create_at: datetime
    attributes: List[Attribute]

    class Meta:
        stored_model_class = ProductVariantModel
