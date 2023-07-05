from abc import ABC, abstractmethod
from typing import Any, Dict

import torch


class AbstractGRU4RecStorage(ABC):
    """
    Base class for GRU4Rec storage to define its functionality.

    """

    @abstractmethod
    def get_module(self, identifier: str) -> torch.nn.Module:
        """
        Gets requested module from the storage.

        Parameters
        ----------
        identifier: str
            Identifier of the requested module.

        Returns
        -------
        torch.nn.Module
            Module from storage given by the identifier.

        """
        raise NotImplementedError()

    @abstractmethod
    def get_parameters(self, identifier: str) -> Dict[str, Any]:
        """
        Gets requested parameters from the storage.

        Parameters
        ----------
        identifier: str
            Identifier of the requested parameters.

        Returns
        -------
        Dict[str, Any]
            Parameters from storage given by the identifier.

        """
        raise NotImplementedError()

    @abstractmethod
    def get_mapping(self, identifier: str) -> Dict[str, int]:
        """
        Gets requested mapping from the storage.

        Parameters
        ----------
        identifier: str
            Identifier of the requested mapping.

        Returns
        -------
        Dict[str, int]
            Mapping from storage given by the identifier.

        """
        raise NotImplementedError()

    @abstractmethod
    def delete_module(self, identifier: str) -> None:
        """
        Deletes requested module from the storage.

        Parameters
        ----------
        identifier: str
            Identifier of the requested module.

        Returns
        -------
        None

        """
        raise NotImplementedError()

    @abstractmethod
    def delete_parameters(self, identifier: str) -> None:
        """
        Deletes requested parameters from the storage.

        Parameters
        ----------
        identifier: str
            Identifier of the requested parameters.

        Returns
        -------
        None

        """
        raise NotImplementedError()

    @abstractmethod
    def delete_mapping(self, identifier: str) -> None:
        """
        Deletes requested mapping from the storage.

        Parameters
        ----------
        identifier: str
            Identifier of the requested mapping.

        Returns
        -------
        None

        """
        raise NotImplementedError()

    @abstractmethod
    def store_module(self, module: torch.nn.Module, identifier: str) -> None:
        """
        Stores `module` to the storage.

        Parameters
        ----------
        module: torch.nn.Module
            Module to be stored to the storage.
        identifier: str
            Module's identifier.

        Returns
        -------
        None

        """
        raise NotImplementedError()

    @abstractmethod
    def store_parameters(self, parameters: Dict[str, Any], identifier: str) -> None:
        """
        Stores `parameters` to the storage.

        Parameters
        ----------
        parameters: Dict[str, Any]
            Parameters to be stored to the storage.
        identifier: str
            Mapping's identifier.

        Returns
        -------
        None

        """
        raise NotImplementedError()

    @abstractmethod
    def store_mapping(self, mapping: Dict[str, int], identifier: str) -> None:
        """
        Stores `mapping` to the storage.

        Parameters
        ----------
        mapping: Dict[str, int]
            Mapping to be stored to the storage.
        identifier: str
            Mapping's identifier.

        Returns
        -------
        None

        """
        raise NotImplementedError()
