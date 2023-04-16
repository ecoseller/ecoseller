from datetime import datetime

from recommender_system.models.stored.base import StoredBaseModel


class ReviewModel(StoredBaseModel):
    """
    This model represents user's review of a product as an object that is
    stored in the database.
    """

    id: int
    session_id: str
    user_id: int
    product_id: int
    rating: int
    update_at: datetime
    create_at: datetime

    class Meta:
        primary_key = "id"
