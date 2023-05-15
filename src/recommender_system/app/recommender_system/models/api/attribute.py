from typing import List, Optional

from recommender_system.models.api.base import ApiBaseModel
from recommender_system.models.stored.product.attribute import AttributeModel


class Attribute(ApiBaseModel):
    """
    This model represents product's attribute as an object that is sent from
    core to RS component via API.
    """

    id: int
    type: int
    raw_value: Optional[str]
    order: Optional[int]
    ext_attributes: List[int]

    class Meta:
        stored_model_class = AttributeModel
