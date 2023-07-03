from abc import ABC, abstractmethod
from typing import Dict

import numpy as np


class AbstractEASEStorage(ABC):
    """
    Base class for EASE storage to define its functionality.

    """

    @abstractmethod
    def get_matrices(self, identifier: str) -> Dict[str, np.ndarray]:
        """
        Gets requested matrices from the storage.

        Parameters
        ----------
        identifier: str
         Identifier of the requested matrices.

        Returns
        -------
        Dict[str, np.ndarray]
         Matrices from storage given by the identifier.

        """
        raise NotImplementedError()

    @abstractmethod
    def get_mappings(self, identifier: str) -> Dict[str, Dict[str, int]]:
        """
        Gets requested mappings from the storage.

        Parameters
        ----------
        identifier: str
         Identifier of the requested mappings.

        Returns
        -------
        Dict[str, Dict[str, int]]
         Mappings from storage given by the identifier.

        """
        raise NotImplementedError()

    @abstractmethod
    def delete_matrices(self, identifier: str) -> None:
        """
        Deletes requested matrices from the storage.

        Parameters
        ----------
        identifier: str
         Identifier of the requested matrices.

        Returns
        -------
        None

        """
        raise NotImplementedError()

    @abstractmethod
    def delete_mappings(self, identifier: str) -> None:
        """
        Deletes requested mappings from the storage.

        Parameters
        ----------
        identifier: str
         Identifier of the requested mappings.

        Returns
        -------
        None

        """
        raise NotImplementedError()

    @abstractmethod
    def store_matrices(self, matrices: Dict[str, np.ndarray], identifier: str) -> None:
        """
        Stores `matrix` to the storage.

        Parameters
        ----------
        matrices: Dict[str, np.ndarray]
         Matrices to be stored to the storage.
        identifier: str
         Matrices' identifier.

        Returns
        -------
        None

        """
        raise NotImplementedError()

    @abstractmethod
    def store_mappings(
        self, mappings: Dict[str, Dict[str, int]], identifier: str
    ) -> None:
        """
        Stores `mappings` to the storage.

        Parameters
        ----------
        mappings: Dict[str, Dict[str, int]]
         Mappings to be stored to the storage.
        identifier: str
         Mapping's identifier.

        Returns
        -------
        None

        """
        raise NotImplementedError()
