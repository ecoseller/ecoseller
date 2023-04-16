from datetime import datetime
from typing import Optional

from recommender_system.models.stored.base import StoredBaseModel


class ProductDetailEnterModel(StoredBaseModel):
    """
    This model represents the event of user entering a possibly recommended
    product's detail (clicking a product) as an object that is stored in the
    database.
    """

    session_id: str
    user_id: Optional[int]
    product_id: int
    recommendation_type: Optional[str]
    position: Optional[int]
    create_at: datetime
