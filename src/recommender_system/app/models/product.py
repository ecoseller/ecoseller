from datetime import datetime
from typing import List

from pydantic import BaseModel

from models.product_variant import ProductVariant


class Product(BaseModel):
    """
    This model represents product as an object that is sent from core to RS component via API.
    """

    id: str
    published: bool
    category_id: int
    title: str
    meta_title: str
    meta_description: str
    short_description: str
    description: str
    slug: str
    product_variants: List[ProductVariant]
    update_at: datetime
    create_at: datetime
