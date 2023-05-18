from abc import ABC, abstractmethod

from recommender_system.models.stored.model.config import ConfigModel
from recommender_system.storage.abstract import AbstractStorage


class AbstractModelStorage(AbstractStorage, ABC):
    """
    Base class for Model storage to define its functionality.

    """

    @abstractmethod
    def get_current_config(self) -> ConfigModel:
        """
        Selects current configuration object from the database.

        Returns
        -------
        ConfigModel
            Current configuration object.

        """
        raise NotImplementedError()
