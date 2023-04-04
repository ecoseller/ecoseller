from typing import Optional

from recommender_system.models.stored.attribute_type import AttributeTypeModel
from recommender_system.models.stored.base import StoredBaseModel
from recommender_system.models.stored.many_to_many_relation import (
    ManyToManyRelationMixin,
)
from recommender_system.models.stored.product_type import ProductTypeModel


class AttributeTypeProductTypeModel(StoredBaseModel, ManyToManyRelationMixin):
    """
    This model represents attribute type and product type relation as an
    object stored in the database.
    """

    id: Optional[int]

    attribute_type_id: int
    product_type_id: int

    class Meta:
        primary_key = "id"

    class RelationMeta:
        source_model_class = AttributeTypeModel
        target_model_class = ProductTypeModel
        source_pk_name = "attribute_type_id"
        target_pk_name = "product_type_id"
