from datetime import datetime
from typing import Optional

from recommender_system.models.api.base import ApiBaseModel
from recommender_system.models.stored.product_price import ProductPriceModel


class ProductPrice(ApiBaseModel):
    """
    This model represents product price as an object that is sent from core to
    RS component via API.
    """

    id: int
    price_list_code: str
    product_variant_sku: Optional[str]
    price: float
    update_at: datetime
    create_at: datetime

    class Meta:
        stored_model_class = ProductPriceModel
