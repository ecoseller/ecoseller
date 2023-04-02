from datetime import datetime

from models.api.base import ApiBaseModel


class ProductTypeModel(ApiBaseModel):
    """
    This model represents product type as an object that is sent from
    core to RS component via API.
    """

    id: int
    name: str
    update_at: datetime
    create_at: datetime
