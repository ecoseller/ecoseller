from datetime import datetime
from typing import Any, List, Optional, TYPE_CHECKING

from models.stored.base import StoredBaseModel
from models.stored.product_type import ProductTypeModel

if TYPE_CHECKING:
    from models.stored.product_product_variant import ProductProductVariantModel
    from models.stored.product_translation import ProductTranslationModel
    from models.stored.product_variant import ProductVariantModel


class ProductModel(StoredBaseModel):
    """
    This model represents product as an object that is stored in the database.
    """

    id: int
    published: bool
    category_id: int
    update_at: datetime
    create_at: datetime

    product_type_id: Optional[int]

    class Meta:
        primary_key = "id"

    @property
    def pk(self) -> Any:
        return self.id

    @property
    def translations(self) -> List["ProductTranslationModel"]:
        from models.stored.product_translation import ProductTranslationModel

        return self._storage.get_objects(
            model_class=ProductTranslationModel, product_id=self.id
        )

    @property
    def type(self) -> Optional[ProductTypeModel]:
        if self.product_type_id is None:
            return None
        return self._storage.get_object(
            model_class=ProductTypeModel, pk=self.product_type_id
        )

    @property
    def variants(self) -> List["ProductVariantModel"]:
        from models.stored.product_product_variant import (
            ProductProductVaritantModel,
        )

        return self._storage.get_related_objects(
            model=self, relation_model_class=ProductProductVaritantModel
        )
