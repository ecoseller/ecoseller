from typing import List

from recommender_system.models.stored.base import (
    StoredBaseModel,
    FeedbackStoredBaseModel,
    ProductStoredBaseModel,
)


class ImmutableFeedbackStoredModel(FeedbackStoredBaseModel):
    """
    Represents feedback model that is immutable.
    """

    @classmethod
    def get(cls, **kwargs) -> StoredBaseModel:
        # Needed because of dependency injector's inability to identify
        # multi-level subclasses
        return super().get(**kwargs)

    @classmethod
    def gets(cls, **kwargs) -> List[StoredBaseModel]:
        # Needed because of dependency injector's inability to identify
        # multi-level subclasses
        return super().gets(**kwargs)

    def save(self) -> None:
        raise TypeError(f"{self.__class__.__name__} is immutable.")

    def refresh(self) -> None:
        raise TypeError(f"{self.__class__.__name__} is immutable.")

    def delete(self) -> None:
        raise TypeError(f"{self.__class__.__name__} is immutable.")


class ImmutableProductStoredModel(ProductStoredBaseModel):
    """
    Represents product model that is immutable.
    """

    @classmethod
    def get(cls, **kwargs) -> StoredBaseModel:
        # Needed because of dependency injector's inability to identify
        # multi-level subclasses
        return super().get(**kwargs)

    @classmethod
    def gets(cls, **kwargs) -> List[StoredBaseModel]:
        # Needed because of dependency injector's inability to identify
        # multi-level subclasses
        return super().gets(**kwargs)

    def save(self) -> None:
        raise TypeError(f"{self.__class__.__name__} is immutable.")

    def refresh(self) -> None:
        raise TypeError(f"{self.__class__.__name__} is immutable.")

    def delete(self) -> None:
        raise TypeError(f"{self.__class__.__name__} is immutable.")
