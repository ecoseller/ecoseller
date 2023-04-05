from datetime import datetime
from typing import Any, List, TYPE_CHECKING

from recommender_system.models.api.base import ApiBaseModel
from recommender_system.models.stored.base import StoredBaseModel

if TYPE_CHECKING:
    from recommender_system.models.stored.attribute_type import (
        AttributeTypeModel,
    )
    from recommender_system.models.stored.product import ProductModel


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

    @classmethod
    def from_api_model(
        cls, model: ApiBaseModel, **kwargs: Any
    ) -> List["StoredBaseModel"]:
        from recommender_system.models.stored.attribute_type import (
            AttributeTypeModel,
        )
        from recommender_system.models.stored.attribute_type_product_type import (
            AttributeTypeProductTypeModel,
        )
        from recommender_system.models.stored.product import ProductModel

        stored = super().from_api_model(model=model, **kwargs)[0]

        result = [stored]

        for product in model.products:
            if product.type_id is None:
                product.type_id = stored.id
            result.extend(ProductModel.from_api_model(model=product))

        for attribute_type in model.attribute_types:
            result.extend(AttributeTypeModel.from_api_model(model=attribute_type))
            result.append(
                AttributeTypeProductTypeModel(
                    attribute_type_id=attribute_type.id, product_type_id=stored.id
                )
            )

        return result

    @property
    def attribute_types(self) -> List["AttributeTypeModel"]:
        from recommender_system.models.stored.attribute_type_product_type import (
            AttributeTypeProductTypeModel,
        )

        return self._storage.get_related_objects(
            model=self, relation_model_class=AttributeTypeProductTypeModel
        )

    @property
    def products(self) -> List["ProductModel"]:
        from recommender_system.models.stored.product import ProductModel

        return self._storage.get_objects(
            model_class=ProductModel, product_type_id=self.id
        )

    def add_attribute_type(self, attribute_type: "AttributeTypeModel") -> None:
        from recommender_system.models.stored.attribute_type_product_type import (
            AttributeTypeProductTypeModel,
        )

        AttributeTypeProductTypeModel(
            attribute_type_id=attribute_type.id, product_type_id=self.id
        ).create()
