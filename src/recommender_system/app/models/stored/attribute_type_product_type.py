from typing import Any

from models.stored.attribute_type import AttributeTypeModel
from models.stored.many_to_many_relation import ManyToManyRelationModel
from models.stored.product_type import ProductTypeModel


class AttributeTypeProductTypeModel(ManyToManyRelationModel):
    """
    This model represents attribute type and product type relation as an
    object stored in the database.
    """

    id: int

    attribute_type_id: int
    product_type_id: int

    class Meta:
        primary_key = "id"
        source_model_class = AttributeTypeModel
        target_model_class = ProductTypeModel
        source_pk_name = "attribute_type_id"
        target_pk_name = "product_type_id"

    @property
    def pk(self) -> Any:
        return self.id
