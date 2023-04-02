from typing import Any

from recommender_system.models.stored.many_to_many_relation import (
    ManyToManyRelationModel,
)
from recommender_system.models.stored.product import ProductModel
from recommender_system.models.stored.product_variant import (
    ProductVariantModel,
)


class ProductProductVariantModel(ManyToManyRelationModel):
    """
    This model represents attribute type and product type relation as an
    object stored in the database.
    """

    id: int

    product_id: int
    product_variant_id: int

    class Meta:
        primary_key = "id"
        source_model_class = ProductModel
        target_model_class = ProductVariantModel
        source_pk_name = "product_id"
        target_pk_name = "product_variant_id"

    @property
    def pk(self) -> Any:
        return self.id
