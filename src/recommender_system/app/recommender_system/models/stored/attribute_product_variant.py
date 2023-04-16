from typing import Optional

from recommender_system.models.stored.base import ProductStoredBaseModel
from recommender_system.models.stored.many_to_many_relation import (
    ManyToManyRelationMixin,
)
from recommender_system.models.stored.attribute import AttributeModel
from recommender_system.models.stored.product_variant import (
    ProductVariantModel,
)


class AttributeProductVariantModel(ProductStoredBaseModel, ManyToManyRelationMixin):
    """
    This model represents attribute and product variant relation as an object
    stored in the database.
    """

    id: Optional[int]

    attribute_id: int
    product_variant_sku: str

    class Meta:
        primary_key = "id"

    class RelationMeta:
        source_model_class = AttributeModel
        target_model_class = ProductVariantModel
        source_pk_name = "attribute_id"
        target_pk_name = "product_variant_sku"
