from datetime import datetime
from typing import Optional

from recommender_system.models.stored.base import StoredBaseModel


class ProductAddedToCartModel(StoredBaseModel):
    """
    This model represents the event of user adding a product to cart as an
    object that is stored in the database.
    """

    session_id: str
    user_id: Optional[int]
    product_id: int
    create_at: datetime
