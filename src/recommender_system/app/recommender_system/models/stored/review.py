from datetime import datetime
from typing import TYPE_CHECKING

from recommender_system.models.stored.immutable import ImmutableFeedbackStoredModel

if TYPE_CHECKING:
    from recommender_system.models.stored.session import SessionModel


class ReviewModel(ImmutableFeedbackStoredModel):
    """
    This model represents user's review of a product as an object that is
    stored in the database.
    """

    id: int
    session_id: str
    user_id: int
    product_id: int
    product_variant_sku: str
    rating: int
    update_at: datetime
    create_at: datetime

    class Meta:
        primary_key = "id"

    @property
    def session(self) -> "SessionModel":
        from recommender_system.models.stored.session import SessionModel

        return SessionModel.get(pk=self.session_id)

    def create(self) -> None:
        from recommender_system.models.stored.session import SessionModel

        super().create()
        try:
            SessionModel.get(pk=self.session_id)
        except SessionModel.DoesNotExist:
            SessionModel(id=self.session_id, user_id=self.user_id).create()
