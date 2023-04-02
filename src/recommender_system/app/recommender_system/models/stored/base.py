from typing import Any, List, TYPE_CHECKING

from dependency_injector.wiring import inject, Provide
from pydantic import BaseModel

if TYPE_CHECKING:
    from recommender_system.storage.abstract import AbstractStorage


class StoredBaseModel(BaseModel):
    """
    This model represents base class for all models stored in the database.
    """

    _storage: "AbstractStorage"

    class Meta:
        primary_key: str = ""

    class Config:
        underscore_attrs_are_private = True

    @inject
    def __init__(
        self, _storage: "AbstractStorage" = Provide["storage"], *args, **kwargs
    ):
        self._storage = _storage
        super().__init__(*args, **kwargs)

    @property
    def pk(self) -> Any:
        raise NotImplementedError()

    @classmethod
    @inject
    def get(
        cls, storage: "AbstractStorage" = Provide["storage"], **kwargs
    ) -> "StoredBaseModel":
        return storage.get_object(model_class=cls, **kwargs)

    @classmethod
    @inject
    def gets(
        cls, storage: "AbstractStorage" = Provide["storage"], **kwargs
    ) -> List["StoredBaseModel"]:
        return storage.get_objects(model_class=cls, **kwargs)

    def create(self) -> None:
        self._storage.store_object(model=self, create=True)

    def save(self) -> None:
        self._storage.store_object(model=self, create=False)

    def refresh(self) -> None:
        self._storage.refresh_object(model=self)

    def delete(self) -> None:
        self._storage.delete_object(model=self)