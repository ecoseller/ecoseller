from datetime import datetime
from typing import List

from pydantic import BaseModel

from models.attribute import Attribute


class ProductVariant(BaseModel):
    """
    This model represents product variant as an object that is sent from core to RS component via API.
    """

    sku: str
    ean: str
    weight: float
    update_at: datetime
    create_at: datetime
    attributes: List[Attribute]
