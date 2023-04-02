from datetime import datetime
from typing import Any, List, TYPE_CHECKING

from recommender_system.models.stored.base import StoredBaseModel

if TYPE_CHECKING:
    from recommender_system.models.stored.attribute_type import (
        AttributeTypeModel,
    )


class ProductTypeModel(StoredBaseModel):
    """
    This model represents product type as an object that is stored in the
    database.
    """

    id: int
    name: str
    update_at: datetime
    create_at: datetime

    class Meta:
        primary_key = "id"

    @property
    def pk(self) -> Any:
        return self.id

    @property
    def attribute_types(self) -> List["AttributeTypeModel"]:
        from recommender_system.models.stored.attribute_type_product_type import (
            AttributeTypeProductTypeModel,
        )

        return self._storage.get_related_objects(
            model=self, relation_model_class=AttributeTypeProductTypeModel
        )
