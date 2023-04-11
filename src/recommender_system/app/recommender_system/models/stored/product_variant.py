from datetime import datetime
from typing import Any, List, TYPE_CHECKING

from recommender_system.models.api.base import ApiBaseModel
from recommender_system.models.stored.base import StoredBaseModel

if TYPE_CHECKING:
    from recommender_system.models.stored.attribute import AttributeModel
    from recommender_system.models.stored.product import ProductModel


class ProductVariantModel(StoredBaseModel):
    """
    This model represents product variant as an object that is stored in
    the database.
    """

    sku: str
    ean: str
    weight: float
    update_at: datetime
    create_at: datetime

    class Meta:
        primary_key = "sku"

    @classmethod
    def from_api_model(
        cls, model: ApiBaseModel, **kwargs: Any
    ) -> List["StoredBaseModel"]:
        from recommender_system.models.stored.attribute import AttributeModel
        from recommender_system.models.stored.attribute_product_variant import (
            AttributeProductVariantModel,
        )

        stored = super().from_api_model(model=model, **kwargs)[0]

        result = [stored]

        for attribute in model.attributes:
            result.extend(AttributeModel.from_api_model(model=attribute))
            result.append(
                AttributeProductVariantModel(
                    attribute_id=attribute.id, product_variant_sku=stored.sku
                )
            )

        return result

    @property
    def attributes(self) -> List["AttributeModel"]:
        from recommender_system.models.stored.attribute_product_variant import (
            AttributeProductVariantModel,
        )

        return self._storage.get_related_objects(
            model=self, relation_model_class=AttributeProductVariantModel
        )

    @property
    def products(self) -> List["ProductModel"]:
        from recommender_system.models.stored.product_product_variant import (
            ProductProductVariantModel,
        )

        return self._storage.get_related_objects(
            model=self, relation_model_class=ProductProductVariantModel
        )

    def delete(self) -> None:
        from recommender_system.models.stored.attribute_product_variant import (
            AttributeProductVariantModel,
        )
        from recommender_system.models.stored.product_product_variant import (
            ProductProductVariantModel,
        )

        super().delete()
        for apv in AttributeProductVariantModel.gets(product_variant_sku=self.sku):
            apv.delete()
        for ppv in ProductProductVariantModel.gets(product_variant_sku=self.sku):
            ppv.delete()

    def add_attribute(self, attribute: "AttributeModel") -> None:
        from recommender_system.models.stored.attribute_product_variant import (
            AttributeProductVariantModel,
        )

        AttributeProductVariantModel(
            attribute_id=attribute.id, product_variant_sku=self.sku
        ).create()

    def add_product(self, product: "ProductModel") -> None:
        from recommender_system.models.stored.product_product_variant import (
            ProductProductVariantModel,
        )

        ProductProductVariantModel(
            product_id=product.id, product_variant_sku=self.sku
        ).create()
