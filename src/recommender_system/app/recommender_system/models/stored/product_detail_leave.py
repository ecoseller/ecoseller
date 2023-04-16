from datetime import datetime
from typing import Optional

from recommender_system.models.stored.base import StoredBaseModel


class ProductDetailLeaveModel(StoredBaseModel):
    """
    This model represents the event of user leaving product's detail page as
    an object that is stored in the database.
    """

    session_id: str
    user_id: Optional[int]
    product_id: int
    time_spent: float
    create_at: datetime
