from typing import Optional

from recommender_system.models.api.base import ApiBaseModel
from recommender_system.models.stored.attribute_type import AttributeTypeModel


class AttributeType(ApiBaseModel):
    """
    This model represents product's attribute type as an object that is sent
    from core to RS component via API.
    """

    id: int
    type_name: Optional[str]
    unit: Optional[str]

    class Meta:
        stored_model_class = AttributeTypeModel
