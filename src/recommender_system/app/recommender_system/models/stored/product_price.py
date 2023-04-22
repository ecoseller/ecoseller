from datetime import datetime
from typing import Optional, TYPE_CHECKING

from recommender_system.models.stored.base import ProductStoredBaseModel

if TYPE_CHECKING:
    from recommender_system.models.stored.product_variant import ProductVariantModel


class ProductPriceModel(ProductStoredBaseModel):
    """
    This model represents product price as an object that is stored in the
    database.
    """

    id: int
    price_list_code: str
    product_variant_sku: Optional[str]
    price: float
    update_at: datetime
    create_at: datetime

    class Meta:
        primary_key = "id"

    @property
    def product_variant(self) -> Optional["ProductVariantModel"]:
        from recommender_system.models.stored.product_variant import ProductVariantModel

        if self.product_variant_sku is None:
            return None

        return ProductVariantModel.get(pk=self.product_variant_sku)
