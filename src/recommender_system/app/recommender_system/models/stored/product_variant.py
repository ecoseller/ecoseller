from datetime import datetime
from typing import Any, List, TYPE_CHECKING

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

    product_id: int

    class Meta:
        primary_key = "id"

    @property
    def pk(self) -> Any:
        return self.id

    @property
    def products(self) -> List["ProductModel"]:
        return self._storage.get_object(model_class=ProductModel, pk=self.product_id)
