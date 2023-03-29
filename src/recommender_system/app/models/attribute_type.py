from pydantic import BaseModel


class AttributeType(BaseModel):
    """
    This model represents product's attribute type as an object that is sent
    from core to RS component via API.
    """

    type_name: str
    unit: str
