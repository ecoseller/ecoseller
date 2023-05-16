from datetime import datetime
from typing import List, Optional, TYPE_CHECKING

from recommender_system.models.stored.product.base import ProductStoredBaseModel

if TYPE_CHECKING:
    from recommender_system.models.stored.product.attribute import AttributeModel
    from recommender_system.models.stored.product.order import OrderModel
    from recommender_system.models.stored.product.product import ProductModel


class ProductVariantModel(ProductStoredBaseModel):
    """
    This model represents product variant as an object that is stored in
    the database.
    """

    sku: str
    ean: str
    weight: Optional[float]
    stock_quantity: int
    recommendation_weight: float
    update_at: datetime
    create_at: datetime

    class Meta:
        primary_key = "sku"

    @property
    def next_pk(self) -> int:
        raise TypeError("ProductVariantModel can not get next pk value.")

    @property
    def attributes(self) -> List["AttributeModel"]:
        from recommender_system.models.stored.product.attribute_product_variant import (
            AttributeProductVariantModel,
        )

        return self._storage.get_related_objects(
            model=self, relation_model_class=AttributeProductVariantModel
        )

    @property
    def orders(self) -> List["OrderModel"]:
        from recommender_system.models.stored.product.order_product_variant import (
            OrderProductVariantModel,
        )

        return self._storage.get_related_objects(
            model=self, relation_model_class=OrderProductVariantModel
        )

    @property
    def products(self) -> List["ProductModel"]:
        from recommender_system.models.stored.product.product_product_variant import (
            ProductProductVariantModel,
        )

        return self._storage.get_related_objects(
            model=self, relation_model_class=ProductProductVariantModel
        )

    def delete(self) -> None:
        from recommender_system.models.stored.product.attribute_product_variant import (
            AttributeProductVariantModel,
        )
        from recommender_system.models.stored.product.order_product_variant import (
            OrderProductVariantModel,
        )
        from recommender_system.models.stored.product.product_product_variant import (
            ProductProductVariantModel,
        )

        for apv in AttributeProductVariantModel.gets(product_variant_sku=self.sku):
            apv.delete()
        for opv in OrderProductVariantModel.gets(product_variant_sku=self.sku):
            opv.delete()
        for ppv in ProductProductVariantModel.gets(product_variant_sku=self.sku):
            ppv.delete()
        super().delete()

    def add_attribute(self, attribute: "AttributeModel") -> None:
        from recommender_system.models.stored.product.attribute_product_variant import (
            AttributeProductVariantModel,
        )

        AttributeProductVariantModel(
            attribute_id=attribute.id, product_variant_sku=self.sku
        ).create()

    def add_order(self, order: "OrderModel", amount: int) -> None:
        from recommender_system.models.stored.product.order_product_variant import (
            OrderProductVariantModel,
        )

        OrderProductVariantModel(
            order_id=order.id, product_variant_sku=self.sku, amount=amount
        ).create()

    def add_product(self, product: "ProductModel") -> None:
        from recommender_system.models.stored.product.product_product_variant import (
            ProductProductVariantModel,
        )

        ProductProductVariantModel(
            product_id=product.id, product_variant_sku=self.sku
        ).create()
