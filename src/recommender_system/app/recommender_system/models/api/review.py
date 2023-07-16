from datetime import datetime

from recommender_system.models.api.immutable import ImmutableApiModel
from recommender_system.models.stored.feedback.review import ReviewModel


class Review(ImmutableApiModel):
    """
    This model represents user's review of a product as an object that is sent
    from core to RS component via API.
    """

    id: int
    session_id: str
    user_id: int
    product_id: int
    product_variant_sku: str
    rating: int
    update_at: datetime = datetime.now()
    create_at: datetime = datetime.now()

    class Meta:
        stored_model_class = ReviewModel
