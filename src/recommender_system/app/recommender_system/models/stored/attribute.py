from typing import Any, List, Optional, TYPE_CHECKING

from recommender_system.models.api.base import ApiBaseModel
from recommender_system.models.stored.attribute_type import AttributeTypeModel
from recommender_system.models.stored.base import (
    StoredBaseModel,
    ProductStoredBaseModel,
)

if TYPE_CHECKING:
    from recommender_system.models.stored.product_variant import (
        ProductVariantModel,
    )


class AttributeModel(ProductStoredBaseModel):
    """
    This model represents product's attribute as an object that is stored in
    the database.
    """

    id: int
    raw_value: Optional[str]
    numeric_value: Optional[float]
    order: Optional[int]

    attribute_type_id: int
    parent_attribute_id: Optional[int]

    class Meta:
        primary_key = "id"

    @classmethod
    def from_api_model(cls, model: ApiBaseModel, **kwargs: Any) -> StoredBaseModel:
        numeric_value = None
        try:
            numeric_value = float(model.raw_value)
        except ValueError:
            pass
        return super().from_api_model(
            model=model,
            attribute_type_id=model.type,
            numeric_value=numeric_value,
            **kwargs
        )

    @property
    def attribute_type(self) -> AttributeTypeModel:
        return self._storage.get_object(
            model_class=AttributeTypeModel, pk=self.attribute_type_id
        )

    @property
    def parent_attribute(self) -> Optional["AttributeModel"]:
        if self.parent_attribute_id is None:
            return None
        return self._storage.get_object(
            model_class=AttributeModel, pk=self.parent_attribute_id
        )

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

    def add_product_variant(self, product_variant: "ProductVariantModel") -> None:
        from recommender_system.models.stored.attribute_product_variant import (
            AttributeProductVariantModel,
        )

        AttributeProductVariantModel(
            attribute_id=self.id, product_variant_sku=product_variant.sku
        ).create()
