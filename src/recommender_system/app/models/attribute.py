from typing import List, Optional

from pydantic import BaseModel

from models.attribute_type import AttributeType


class Attribute(BaseModel):
    """
    This model represents product's attribute as an object that is sent from core to RS component via API.
    """

    type: AttributeType
    value: str
    order: Optional[int]
    ext_attributes: List["Attribute"]
