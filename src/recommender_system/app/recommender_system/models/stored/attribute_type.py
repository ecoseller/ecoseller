from typing import List, Optional, TYPE_CHECKING

from recommender_system.models.stored.base import ProductStoredBaseModel

if TYPE_CHECKING:
    from recommender_system.models.stored.attribute import AttributeModel
    from recommender_system.models.stored.product_type import ProductTypeModel


class AttributeTypeModel(ProductStoredBaseModel):
    """
    This model represents product's attribute type as an object that is stored
    in the database.
    """

    id: int
    type_name: Optional[str]
    unit: Optional[str]

    class Meta:
        primary_key = "id"

    @property
    def attributes(self) -> List["AttributeModel"]:
        from recommender_system.models.stored.attribute import AttributeModel

        return self._storage.get_objects(
            model_class=AttributeModel, attribute_type_id=self.id
        )

    @property
    def product_types(self) -> List["ProductTypeModel"]:
        from recommender_system.models.stored.attribute_type_product_type import (
            AttributeTypeProductTypeModel,
        )

        return self._storage.get_related_objects(
            model=self, relation_model_class=AttributeTypeProductTypeModel
        )

    def add_product_type(self, product_type: "ProductTypeModel") -> None:
        from recommender_system.models.stored.attribute_type_product_type import (
            AttributeTypeProductTypeModel,
        )

        AttributeTypeProductTypeModel(
            attribute_type_id=self.id, product_type_id=product_type.id
        ).create()
