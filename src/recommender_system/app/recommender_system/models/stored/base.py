from typing import Any, List, TYPE_CHECKING

from recommender_system.models.api.base import ApiBaseModel
from recommender_system.utils.base_model import BaseModel

if TYPE_CHECKING:
    from recommender_system.storage.abstract import AbstractStorage


class StoredBaseModel(BaseModel):
    """
    This model represents base class for all models stored in the database.
    """

    _storage: "AbstractStorage"
    deleted: bool = False

    class Meta:
        primary_key: str

    class Config:
        underscore_attrs_are_private = True

    class DoesNotExist(Exception):
        pass

    def __init__(self, _storage: "AbstractStorage", **kwargs):
        self._storage = _storage
        super().__init__(**kwargs)

    @classmethod
    def from_api_model(cls, model: ApiBaseModel, **kwargs: Any) -> "StoredBaseModel":
        data = model.dict()
        data.update(kwargs)
        return cls.parse_obj(data)

    @classmethod
    def get_next_pk(cls, storage: "AbstractStorage") -> int:
        return storage.get_next_pk(model_class=cls)

    @property
    def pk(self) -> Any:
        return getattr(self, self.Meta.primary_key)

    @classmethod
    def get(cls, storage: "AbstractStorage", **kwargs) -> "StoredBaseModel":
        return storage.get_object(model_class=cls, **kwargs)

    @classmethod
    def get_latest(cls, storage: "AbstractStorage", **kwargs) -> "StoredBaseModel":
        return storage.get_latest_object(model_class=cls, **kwargs)

    @classmethod
    def gets(cls, storage: "AbstractStorage", **kwargs) -> List["StoredBaseModel"]:
        return storage.get_objects(model_class=cls, **kwargs)

    def create(self) -> None:
        pk = self._storage.store_object(model=self, create=True)
        setattr(self, self.Meta.primary_key, pk)

    def save(self) -> None:
        _ = self._storage.store_object(model=self, create=False)

    def refresh(self) -> None:
        self._storage.refresh_object(model=self)

    def delete(self) -> None:
        self._storage.delete_object(model=self)
