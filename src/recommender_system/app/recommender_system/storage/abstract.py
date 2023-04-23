from abc import ABC, abstractmethod
from typing import Any, List, Type

from recommender_system.models.stored.base import StoredBaseModel
from recommender_system.models.stored.many_to_many_relation import (
    ManyToManyRelationMixin,
)


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

        Raises model_class.DoesNotExist if model is not found in storage.
        Raises MultipleObjectsReturned if multiple models are found in
        storage.
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
    def get_objects_attribute(
        self, model_class: Type[StoredBaseModel], attribute: str, **kwargs
    ) -> List[Any]:
        """
        Searches for models of type `model_class` and returns their attribute
        `attribute`.
        """
        raise NotImplementedError()

    @abstractmethod
    def get_random_weighted_attribute(
        self, model_class: Type[StoredBaseModel], attribute: str, weight: str, **kwargs
    ) -> List[Any]:
        """
        Searches for models of type `model_class` and returns their attribute
        `attribute` randomly sampled by weights specified by attribute
        `weight`.
        """
        raise NotImplementedError()

    @abstractmethod
    def get_related_objects(
        self,
        model: StoredBaseModel,
        relation_model_class: Type[ManyToManyRelationMixin],
    ) -> List[StoredBaseModel]:
        """
        Searches for target models of relation `relation_model_class` where
        source is `model`.
        """
        raise NotImplementedError()

    @abstractmethod
    def store_object(self, model: StoredBaseModel, create: bool = False) -> Any:
        """
        Stores `model` instance in storage.

        Creates instance if `create` is True, updates if `create` is False.

        Returns primary key of stored object.
        """
        raise NotImplementedError()

    @abstractmethod
    def refresh_object(self, model: StoredBaseModel) -> None:
        """
        Refreshes `model` instance from recommender_system.storage.
        """
        raise NotImplementedError()

    @abstractmethod
    def delete_object(self, model: StoredBaseModel) -> None:
        """
        Deletes `model` instance from recommender_system.storage.
        """
        raise NotImplementedError()
