from datetime import datetime
from typing import List

from recommender_system.models.api.attribute import Attribute
from recommender_system.models.api.base import ApiBaseModel


class ProductVariant(ApiBaseModel):
    """
    This model represents product variant as an object that is sent from core
    to RS component via API.
    """

    sku: str
    ean: str
    weight: float
    update_at: datetime
    create_at: datetime
    attributes: List[Attribute]
