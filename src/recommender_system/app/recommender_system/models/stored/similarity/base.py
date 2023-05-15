from typing import List, TYPE_CHECKING

from dependency_injector.wiring import inject, Provide

from recommender_system.models.stored.base import StoredBaseModel

if TYPE_CHECKING:
    from recommender_system.storage.abstract import AbstractStorage


class SimilarityStoredBaseModel(StoredBaseModel):
    """
    This model represents base class for all models stored in the similarity database.
    """

    @inject
    def __init__(
        self,
        _storage: "AbstractStorage" = Provide["similarity_storage"],
        *args,
        **kwargs
    ):
        super().__init__(_storage=_storage, *args, **kwargs)

    @classmethod
    @inject
    def get_next_pk(
        cls, storage: "AbstractStorage" = Provide["similarity_storage"]
    ) -> int:
        return super().get_next_pk(storage=storage)

    @classmethod
    @inject
    def get(
        cls, storage: "AbstractStorage" = Provide["similarity_storage"], **kwargs
    ) -> "StoredBaseModel":
        return super().get(storage=storage, **kwargs)

    @classmethod
    @inject
    def gets(
        cls, storage: "AbstractStorage" = Provide["similarity_storage"], **kwargs
    ) -> List["StoredBaseModel"]:
        return super().gets(storage=storage, **kwargs)
