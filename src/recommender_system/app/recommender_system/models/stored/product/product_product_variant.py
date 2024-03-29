from typing import Optional

from recommender_system.models.stored.product.base import ProductStoredBaseModel
from recommender_system.models.stored.many_to_many_relation import (
    ManyToManyRelationMixin,
)
from recommender_system.models.stored.product.product import ProductModel
from recommender_system.models.stored.product.product_variant import (
    ProductVariantModel,
)


class ProductProductVariantModel(ProductStoredBaseModel, ManyToManyRelationMixin):
    """
    This model represents attribute type and product type relation as an
    object stored in the database.
    """

    id: Optional[int]

    product_id: int
    product_variant_sku: str

    class Meta:
        primary_key = "id"

    class RelationMeta:
        source_model_class = ProductModel
        target_model_class = ProductVariantModel
        source_pk_name = "product_id"
        target_pk_name = "product_variant_sku"
