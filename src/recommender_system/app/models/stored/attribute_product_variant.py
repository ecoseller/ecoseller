from typing import Any

from models.stored.many_to_many_relation import ManyToManyRelationModel
from models.stored.attribute import AttributeModel
from models.stored.product_variant import ProductVariantModel


class AttributeProductVariantModel(ManyToManyRelationModel):
    """
    This model represents attribute and product variant relation as an object
    stored in the database.
    """

    id: int

    attribute_id: int
    product_variant_id: int

    class Meta:
        primary_key = "id"
        source_model_class = AttributeModel
        target_model_class = ProductVariantModel
        source_pk_name = "attribute_id"
        target_pk_name = "product_variant_id"

    @property
    def pk(self) -> Any:
        return self.id
