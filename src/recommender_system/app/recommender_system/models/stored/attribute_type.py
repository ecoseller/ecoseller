from typing import Any, List, TYPE_CHECKING

from recommender_system.models.stored.attribute import AttributeModel
from recommender_system.models.stored.base import StoredBaseModel

if TYPE_CHECKING:
    from recommender_system.models.stored.product_type import ProductTypeModel


class AttributeTypeModel(StoredBaseModel):
    """
    This model represents product's attribute type as an object that is stored
    in the database.
    """

    id: int
    type_name: str
    unit: str

    class Meta:
        primary_key = "id"

    @property
    def attributes(self) -> List[AttributeModel]:
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
