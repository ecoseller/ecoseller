from datetime import datetime
from typing import List, Optional

from recommender_system.models.api.base import ApiBaseModel
from recommender_system.models.api.product_translation import (
    ProductTranslation,
)
from recommender_system.models.stored.product.product import ProductModel


class Product(ApiBaseModel):
    """
    This model represents product as an object that is sent from core to RS
    component via API.
    """

    id: int
    published: bool
    category_id: Optional[int]
    type_id: Optional[int]
    product_translations: List[ProductTranslation]
    product_variants: List[str]
    update_at: datetime
    create_at: datetime

    class Meta:
        stored_model_class = ProductModel

    def save(self) -> None:
        super().save()
        product_model = ProductModel.get(pk=self.id)
        product_model.update_product_variants(product_variants=self.product_variants)
