from datetime import datetime
from typing import List, TYPE_CHECKING

from dependency_injector.wiring import inject, Provide

from recommender_system.models.stored.product.base import ProductStoredBaseModel
from recommender_system.storage.product.abstract import AbstractProductStorage

if TYPE_CHECKING:
    from recommender_system.models.stored.product.attribute_type import (
        AttributeTypeModel,
    )
    from recommender_system.models.stored.product.product import ProductModel


class ProductTypeModel(ProductStoredBaseModel):
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
    def attribute_types(self) -> List["AttributeTypeModel"]:
        from recommender_system.models.stored.product.attribute_type_product_type import (
            AttributeTypeProductTypeModel,
        )

        return self._storage.get_related_objects(
            model=self, relation_model_class=AttributeTypeProductTypeModel
        )

    @property
    def products(self) -> List["ProductModel"]:
        from recommender_system.models.stored.product.product import ProductModel

        return self._storage.get_objects(
            model_class=ProductModel, product_type_id=self.id
        )

    def add_attribute_type(self, attribute_type: "AttributeTypeModel") -> None:
        from recommender_system.models.stored.product.attribute_type_product_type import (
            AttributeTypeProductTypeModel,
        )

        AttributeTypeProductTypeModel(
            attribute_type_id=attribute_type.id, product_type_id=self.id
        ).create()

    @inject
    def update_attribute_types(
        self,
        attribute_types: List[int],
        product_storage: AbstractProductStorage = Provide["product_storage"],
    ) -> None:
        from recommender_system.models.stored.product.attribute_type_product_type import (
            AttributeTypeProductTypeModel,
        )

        for atpt in AttributeTypeProductTypeModel.gets(product_type_id=self.id):
            atpt.delete()

        atpts = [
            AttributeTypeProductTypeModel(
                attribute_type_id=attribute_type, product_type_id=self.id
            )
            for attribute_type in attribute_types
        ]

        product_storage.bulk_create_objects(models=atpts)
