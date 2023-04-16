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
    value: str
    order: Optional[int]

    attribute_type_id: int
    parent_attribute_id: Optional[int]

    class Meta:
        primary_key = "id"

    @classmethod
    def from_api_model(
        cls, model: ApiBaseModel, **kwargs: Any
    ) -> List[StoredBaseModel]:
        attribute_type = AttributeTypeModel.from_api_model(model=model.type)[0]
        stored = super().from_api_model(
            model=model, attribute_type_id=attribute_type.id, **kwargs
        )[0]

        result = [attribute_type, stored]

        for attribute in model.ext_attributes:
            result.extend(
                AttributeModel.from_api_model(
                    model=attribute, parent_attribute_id=stored.id
                )
            )

        return result

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
