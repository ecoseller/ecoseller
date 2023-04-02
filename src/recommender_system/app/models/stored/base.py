from abc import ABC, abstractmethod
from typing import Any, List, TYPE_CHECKING

from dependency_injector.wiring import inject, Provide
from pydantic import BaseModel

if TYPE_CHECKING:
    from storage.abstract import AbstractStorage


class StoredBaseModel(BaseModel, ABC):
    """
    This model represents base class for all models stored in the database.
    """

    _storage: "AbstractStorage"

    class Meta:
        primary_key: str = ""

    @inject
    def __init__(
        self, storage: "AbstractStorage" = Provide["storage"], *args, **kwargs
    ):
        self._storage = storage
        super().__init__(*args, **kwargs)

    def __eq__(self, other: "StoredBaseModel") -> bool:
        return self.pk == other.pk

    @property
    @abstractmethod
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
        self._storage.create_object(model=self)

    def save(self) -> None:
        self._storage.update_object(model=self)

    def refresh(self) -> None:
        self._storage.refresh_object(model=self)

    def delete(self) -> None:
        self._storage.delete_object(model=self)
