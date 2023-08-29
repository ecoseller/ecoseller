from datetime import datetime
from typing import List, Optional, TYPE_CHECKING

from dependency_injector.wiring import inject, Provide

from recommender_system.models.stored.feedback.base import (
    FeedbackStoredBaseModel,
)

if TYPE_CHECKING:
    from recommender_system.managers.model_manager import ModelManager


class SessionModel(FeedbackStoredBaseModel):
    """
    This model represents session as an object that is stored in the database.
    """

    id: str
    user_id: Optional[int]
    visited_product_variants: List[str] = []
    create_at: datetime = datetime.now()

    class Meta:
        primary_key = "id"

    @inject
    def create(self, model_manager: "ModelManager" = Provide["model_manager"]) -> None:
        super().create()
        model_manager.sessions_modified()

    @inject
    def save(self, model_manager: "ModelManager" = Provide["model_manager"]) -> None:
        super().save()
        model_manager.sessions_modified()

    def delete(self, model_manager: "ModelManager" = Provide["model_manager"]) -> None:
        super().delete()
        model_manager.sessions_modified()
