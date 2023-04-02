from abc import ABC, abstractmethod
from typing import List, Type

from models.stored.base import StoredBaseModel
from models.stored.many_to_many_relation import ManyToManyRelationModel


class AbstractStorage(ABC):
    """
    Base class to define storage functionality to be implemented based on
    actual storage used.
    """

    @abstractmethod
    def makemigrations(self) -> None:
        """
        Creates migrations based on specified DB structure.
        """
        raise NotImplementedError()

    @abstractmethod
    def mergemigrations(self) -> None:
        """
        Merges migrations (current heads into one).
        """
        raise NotImplementedError()

    @abstractmethod
    def migrate(self) -> None:
        """
        Applies migrations.
        """
        raise NotImplementedError()

    @abstractmethod
    def get_object(
        self, model_class: Type[StoredBaseModel], **kwargs
    ) -> StoredBaseModel:
        """
        Searches for model of type `model_class` and returns it if found.
        Raises ModelNotFoundException if model is not found in storage.
        """
        raise NotImplementedError()

    @abstractmethod
    def get_objects(
        self, model_class: Type[StoredBaseModel], **kwargs
    ) -> List[StoredBaseModel]:
        """
        Searches for models of type `model_class` and returns them.
        """
        raise NotImplementedError()

    @abstractmethod
    def get_related_objects(
        self,
        model: StoredBaseModel,
        relation_model_class: Type[ManyToManyRelationModel],
    ) -> List[StoredBaseModel]:
        """
        Searches for target models of relation `relation_model_class` where
        source is `model`.
        """
        raise NotImplementedError()

    @abstractmethod
    def create_object(self, model: StoredBaseModel) -> None:
        """
        Creates `model` instance in storage.
        """
        raise NotImplementedError()

    @abstractmethod
    def update_object(self, model: StoredBaseModel) -> None:
        """
        Updates `model` instance in storage.
        """
        raise NotImplementedError()

    @abstractmethod
    def refresh_object(self, model: StoredBaseModel) -> None:
        """
        Refreshes `model` instance from storage.
        """
        raise NotImplementedError()

    @abstractmethod
    def delete_object(self, model: StoredBaseModel) -> None:
        """
        Deletes `model` instance from storage.
        """
        raise NotImplementedError()
