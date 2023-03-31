from datetime import datetime
from typing import List

from pydantic import BaseModel

from models.product_translation import ProductTranslation
from models.product_variant import ProductVariant


class Product(BaseModel):
    """
    This model represents product as an object that is sent from core to RS
    component via API.
    """

    id: str
    published: bool
    category_id: int
    product_locales: List[ProductTranslation]
    product_variants: List[ProductVariant]
    update_at: datetime
    create_at: datetime
