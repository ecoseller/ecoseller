from datetime import datetime
from typing import List

from recommender_system.models.api.attribute_type import AttributeType
from recommender_system.models.api.base import ApiBaseModel
from recommender_system.models.api.product import Product


class ProductType(ApiBaseModel):
    """
    This model represents product type as an object that is sent from
    core to RS component via API.
    """

    id: int
    name: str
    update_at: datetime
    create_at: datetime
    products: List[Product] = []
    attribute_types: List[AttributeType] = []
