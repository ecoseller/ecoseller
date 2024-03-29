from typing import List, TYPE_CHECKING

from dependency_injector.wiring import inject, Provide
from recommender_system.models.stored.base import StoredBaseModel

if TYPE_CHECKING:
    from recommender_system.storage.feedback.abstract import AbstractFeedbackStorage


class FeedbackStoredBaseModel(StoredBaseModel):
    """
    This model represents base class for all models stored in the feedback database.
    """

    @inject
    def __init__(
        self,
        _storage: "AbstractFeedbackStorage" = Provide["feedback_storage"],
        **kwargs
    ):
        self._storage = _storage
        super().__init__(_storage=_storage, **kwargs)

    @classmethod
    @inject
    def get_next_pk(
        cls, storage: "AbstractFeedbackStorage" = Provide["feedback_storage"]
    ) -> int:
        return super().get_next_pk(storage=storage)

    @classmethod
    @inject
    def get(
        cls, storage: "AbstractFeedbackStorage" = Provide["feedback_storage"], **kwargs
    ) -> "StoredBaseModel":
        return super().get(storage=storage, **kwargs)

    @classmethod
    @inject
    def get_latest(
        cls, storage: "AbstractFeedbackStorage" = Provide["feedback_storage"], **kwargs
    ) -> "StoredBaseModel":
        return super().get_latest(storage=storage, **kwargs)

    @classmethod
    @inject
    def gets(
        cls, storage: "AbstractFeedbackStorage" = Provide["feedback_storage"], **kwargs
    ) -> List["StoredBaseModel"]:
        return super().gets(storage=storage, **kwargs)
