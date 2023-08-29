from abc import ABC, abstractmethod
from datetime import datetime
from typing import Optional, TYPE_CHECKING, Dict

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

    @abstractmethod
    def count_trainings(
        self, date_from: datetime, date_to: datetime, model_name: Optional[str]
    ) -> Dict[str, int]:
        raise NotImplementedError()

    @abstractmethod
    def get_peak_memory(
        self, date_from: datetime, date_to: datetime, model_name: Optional[str]
    ) -> Dict[str, Dict[str, int]]:
        raise NotImplementedError()

    @abstractmethod
    def get_training_duration(
        self, date_from: datetime, date_to: datetime, model_name: Optional[str]
    ) -> Dict[str, int]:
        raise NotImplementedError()
