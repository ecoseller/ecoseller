from typing import Any, List, Optional, TYPE_CHECKING

from recommender_system.models.stored.base import StoredBaseModel

if TYPE_CHECKING:
    from recommender_system.models.stored.attribute_product_variant import (
        AttributeProductVariantModel,
    )
    from recommender_system.models.stored.product_variant import (
        ProductVariantModel,
    )


class AttributeModel(StoredBaseModel):
    """
    This model represents product's attribute as an object that is stored in
    the database.
    """

    id: int
    value: str
    order: Optional[int]

    attribute_type_id: int
    parent_attribute_id: Optional[int]

    class Meta:
        primary_key = "id"

    @property
    def pk(self) -> Any:
        return self.id

    @property
    def ext_attributes(self) -> List["AttributeModel"]:
        return self._storage.get_objects(
            model_class=AttributeModel, parent_attribute_id=self.id
        )

    @property
    def product_variants(self) -> List["ProductVariantModel"]:
        from recommender_system.models.stored.attribute_product_variant import (
            AttributeProductVariantModel,
        )

        return self._storage.get_related_objects(
            model=self, relation_model_class=AttributeProductVariantModel
        )
