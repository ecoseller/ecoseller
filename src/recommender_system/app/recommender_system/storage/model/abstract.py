from abc import ABC, abstractmethod
from datetime import datetime
from typing import Optional, TYPE_CHECKING

from recommender_system.storage.abstract import AbstractStorage

if TYPE_CHECKING:
    from recommender_system.models.stored.model.config import ConfigModel


class AbstractModelStorage(AbstractStorage, ABC):
    """
    Base class for Model storage to define its functionality.

    """

    @abstractmethod
    def get_current_config(self) -> "ConfigModel":
        """
        Selects current configuration object from the database.

        Returns
        -------
        ConfigModel
            Current configuration object.

        """
        raise NotImplementedError()

    @abstractmethod
    def get_last_training_date(
        self, model_name: str, full_train: bool = False
    ) -> Optional[datetime]:
        raise NotImplementedError()

    @abstractmethod
    def count_incremental_trainings(self, model_name: str) -> int:
        raise NotImplementedError()
