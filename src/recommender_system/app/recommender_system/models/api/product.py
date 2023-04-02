from datetime import datetime
from typing import List

from recommender_system.models.api.base import ApiBaseModel
from recommender_system.models.api.product_translation import ProductTranslation
from recommender_system.models.api.product_variant import ProductVariant


class Product(ApiBaseModel):
    """
    This model represents product as an object that is sent from core to RS
    component via API.
    """

    id: int
    published: bool
    category_id: int
    product_translations: List[ProductTranslation]
    product_variants: List[ProductVariant]
    update_at: datetime
    create_at: datetime
