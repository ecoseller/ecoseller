from typing import Any, List, TYPE_CHECKING

from dependency_injector.wiring import inject, Provide
from pydantic import BaseModel

from recommender_system.models.api.base import ApiBaseModel

if TYPE_CHECKING:
    from recommender_system.storage.abstract import AbstractStorage


class StoredBaseModel(BaseModel):
    """
    This model represents base class for all models stored in the database.
    """

    _storage: "AbstractStorage"

    class Meta:
        primary_key: str

    class Config:
        underscore_attrs_are_private = True

    class DoesNotExist(Exception):
        pass

    def __init__(self, *args, **kwargs):
        self._storage = kwargs.pop("_storage")
        super().__init__(*args, **kwargs)

    @classmethod
    def from_api_model(cls, model: ApiBaseModel, **kwargs: Any) -> "StoredBaseModel":
        data = model.dict()
        data.update(kwargs)
        return cls.parse_obj(data)

    @property
    def pk(self) -> Any:
        return getattr(self, self.Meta.primary_key)

    @classmethod
    def get(cls, **kwargs) -> "StoredBaseModel":
        return kwargs.pop("storage").get_object(model_class=cls, **kwargs)

    @classmethod
    def gets(cls, **kwargs) -> List["StoredBaseModel"]:
        return kwargs.pop("storage").get_objects(model_class=cls, **kwargs)

    def create(self) -> None:
        pk = self._storage.store_object(model=self, create=True)
        setattr(self, self.Meta.primary_key, pk)

    def save(self) -> None:
        _ = self._storage.store_object(model=self, create=False)

    def refresh(self) -> None:
        self._storage.refresh_object(model=self)

    def delete(self) -> None:
        self._storage.delete_object(model=self)


class FeedbackStoredBaseModel(StoredBaseModel):
    """
    This model represents base class for all models stored in the feedback database.
    """

    @inject
    def __init__(
        self, _storage: "AbstractStorage" = Provide["feedback_storage"], *args, **kwargs
    ):
        self._storage = _storage
        super().__init__(_storage=_storage, *args, **kwargs)

    @classmethod
    @inject
    def get(
        cls, storage: "AbstractStorage" = Provide["feedback_storage"], **kwargs
    ) -> "StoredBaseModel":
        return super().get(storage=storage, **kwargs)

    @classmethod
    @inject
    def gets(
        cls, storage: "AbstractStorage" = Provide["feedback_storage"], **kwargs
    ) -> List["StoredBaseModel"]:
        return super().gets(storage=storage, **kwargs)


class ProductStoredBaseModel(StoredBaseModel):
    """
    This model represents base class for all models stored in the product database.
    """

    @inject
    def __init__(
        self, _storage: "AbstractStorage" = Provide["product_storage"], *args, **kwargs
    ):
        super().__init__(_storage=_storage, *args, **kwargs)

    @classmethod
    @inject
    def get(
        cls, storage: "AbstractStorage" = Provide["product_storage"], **kwargs
    ) -> "StoredBaseModel":
        return super().get(storage=storage, **kwargs)

    @classmethod
    @inject
    def gets(
        cls, storage: "AbstractStorage" = Provide["product_storage"], **kwargs
    ) -> List["StoredBaseModel"]:
        return super().gets(storage=storage, **kwargs)
