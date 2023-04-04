from datetime import datetime
from typing import List, TYPE_CHECKING

from recommender_system.models.stored.base import StoredBaseModel

if TYPE_CHECKING:
    from recommender_system.models.stored.product import ProductModel


class ProductVariantModel(StoredBaseModel):
    """
    This model represents product variant as an object that is stored in
    the database.
    """

    sku: str
    ean: str
    weight: float
    update_at: datetime
    create_at: datetime

    class Meta:
        primary_key = "sku"

    @property
    def products(self) -> List["ProductModel"]:
        from recommender_system.models.stored.product_product_variant import (
            ProductProductVariantModel,
        )

        return self._storage.get_related_objects(
            model=self, relation_model_class=ProductProductVariantModel
        )

    def delete(self) -> None:
        from recommender_system.models.stored.product_product_variant import (
            ProductProductVariantModel,
        )

        super().delete()
        for ppv in ProductProductVariantModel.gets(product_variant_sku=self.sku):
            ppv.delete()
