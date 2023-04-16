from datetime import datetime
from typing import Optional, TYPE_CHECKING

from recommender_system.models.stored.immutable import ImmutableFeedbackStoredModel

if TYPE_CHECKING:
    from recommender_system.models.stored.session import SessionModel


class ProductDetailEnterModel(ImmutableFeedbackStoredModel):
    """
    This model represents the event of user entering a possibly recommended
    product's detail (clicking a product) as an object that is stored in the
    database.
    """

    id: Optional[int]
    session_id: str
    user_id: Optional[int]
    product_id: int
    recommendation_type: Optional[str]
    position: Optional[int]
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
