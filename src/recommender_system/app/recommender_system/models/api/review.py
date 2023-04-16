from datetime import datetime

from recommender_system.models.api.base import ApiBaseModel


class Review(ApiBaseModel):
    """
    This model represents user's review of a product as an object that is sent
    from core to RS component via API.
    """

    id: int
    session_id: str
    user_id: int
    product_id: int
    rating: int
    update_at: datetime
    create_at: datetime
