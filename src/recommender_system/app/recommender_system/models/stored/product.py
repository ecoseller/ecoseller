from datetime import datetime
from typing import List, Optional, TYPE_CHECKING

from recommender_system.models.stored.base import StoredBaseModel
from recommender_system.models.stored.product_type import ProductTypeModel

if TYPE_CHECKING:
    from recommender_system.models.stored.product_translation import (
        ProductTranslationModel,
    )
    from recommender_system.models.stored.product_variant import (
        ProductVariantModel,
    )


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
    def translations(self) -> List["ProductTranslationModel"]:
        from recommender_system.models.stored.product_translation import (
            ProductTranslationModel,
        )

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
        for ppv in ProductProductVariantModel.gets(product_id=self.id):
            ppv.delete()
