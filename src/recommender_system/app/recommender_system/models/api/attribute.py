from typing import List, Optional

from recommender_system.models.api.attribute_type import AttributeType
from recommender_system.models.api.base import ApiBaseModel


class Attribute(ApiBaseModel):
    """
    This model represents product's attribute as an object that is sent from
    core to RS component via API.
    """

    id: int
    type: AttributeType
    value: str
    order: Optional[int]
    ext_attributes: List["Attribute"]
