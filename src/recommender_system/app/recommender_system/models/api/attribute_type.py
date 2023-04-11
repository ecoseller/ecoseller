from recommender_system.models.api.base import ApiBaseModel


class AttributeType(ApiBaseModel):
    """
    This model represents product's attribute type as an object that is sent
    from core to RS component via API.
    """

    id: int
    type_name: str
    unit: str
