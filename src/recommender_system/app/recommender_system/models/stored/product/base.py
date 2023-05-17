from typing import List, TYPE_CHECKING

from dependency_injector.wiring import inject, Provide

from recommender_system.models.stored.base import StoredBaseModel

if TYPE_CHECKING:
    from recommender_system.managers.model_manager import ModelManager
    from recommender_system.storage.product.abstract import AbstractProductStorage


class ProductStoredBaseModel(StoredBaseModel):
    """
    This model represents base class for all models stored in the product database.
    """

    @inject
    def __init__(
        self,
        _storage: "AbstractProductStorage" = Provide["product_storage"],
        *args,
        **kwargs
    ):
        super().__init__(_storage=_storage, *args, **kwargs)

    @classmethod
    @inject
    def get_next_pk(
        cls, storage: "AbstractProductStorage" = Provide["product_storage"]
    ) -> int:
        return super().get_next_pk(storage=storage)

    @classmethod
    @inject
    def get(
        cls, storage: "AbstractProductStorage" = Provide["product_storage"], **kwargs
    ) -> "StoredBaseModel":
        return super().get(storage=storage, **kwargs)

    @classmethod
    @inject
    def gets(
        cls, storage: "AbstractProductStorage" = Provide["product_storage"], **kwargs
    ) -> List["StoredBaseModel"]:
        return super().gets(storage=storage, **kwargs)

    @inject
    def create(self, model_manager: "ModelManager" = Provide["model_manager"]) -> None:
        super().create()
        model_manager.products_modified()

    @inject
    def save(self, model_manager: "ModelManager" = Provide["model_manager"]) -> None:
        super().save()
        model_manager.products_modified()

    def delete(self, model_manager: "ModelManager" = Provide["model_manager"]) -> None:
        super().delete()
        model_manager.products_modified()
