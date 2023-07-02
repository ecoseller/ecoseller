from typing import Optional
import uuid

from recommender_system.models.stored.product.base import ProductStoredBaseModel
from recommender_system.models.stored.many_to_many_relation import (
    ManyToManyRelationMixin,
)
from recommender_system.models.stored.product.order import OrderModel
from recommender_system.models.stored.product.product_variant import (
    ProductVariantModel,
)


class OrderProductVariantModel(ProductStoredBaseModel, ManyToManyRelationMixin):
    """
    This model represents order and product variant relation as an object
    stored in the database.
    """

    id: Optional[int]
    quantity: int

    order_token: uuid.UUID
    product_variant_sku: str

    class Meta:
        primary_key = "id"

    class RelationMeta:
        source_model_class = OrderModel
        target_model_class = ProductVariantModel
        source_pk_name = "order_token"
        target_pk_name = "product_variant_sku"
