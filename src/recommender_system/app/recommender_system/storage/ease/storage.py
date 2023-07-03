import json
import os
from typing import Any, Dict

import numpy as np

from recommender_system.storage.ease.abstract import AbstractEASEStorage


class FileEASEStorage(AbstractEASEStorage):
    directory: str

    def __init__(self, directory: str):
        self.directory = directory

    def _get_matrices_path(self, identifier: str) -> str:
        return os.path.join(self.directory, f"{identifier}_matrices.npz")

    def _get_parameters_path(self, identifier: str) -> str:
        return os.path.join(self.directory, f"{identifier}_parameters.json")

    def _get_mappings_path(self, identifier: str) -> str:
        return os.path.join(self.directory, f"{identifier}_mappings.json")

    def get_matrices(self, identifier: str) -> Dict[str, np.ndarray]:
        return np.load(self._get_matrices_path(identifier=identifier))

    def get_parameters(self, identifier: str) -> Dict[str, Any]:
        with open(self._get_parameters_path(identifier=identifier), mode="r") as file:
            return json.load(file)

    def get_mappings(self, identifier: str) -> Dict[str, Dict[str, int]]:
        with open(self._get_mappings_path(identifier=identifier), mode="r") as file:
            return json.load(file)

    def delete_matrices(self, identifier: str) -> None:
        os.remove(self._get_matrices_path(identifier=identifier))

    def delete_parameters(self, identifier: str) -> None:
        os.remove(self._get_parameters_path(identifier=identifier))

    def delete_mappings(self, identifier: str) -> None:
        os.remove(self._get_mappings_path(identifier=identifier))

    def store_matrices(self, matrices: Dict[str, np.ndarray], identifier: str) -> None:
        np.savez(file=self._get_matrices_path(identifier=identifier), **matrices)

    def store_parameters(self, parameters: Dict[str, Any], identifier: str) -> None:
        with open(self._get_parameters_path(identifier=identifier), mode="w+") as file:
            json.dump(parameters, file, indent=4)

    def store_mappings(
        self, mappings: Dict[str, Dict[str, int]], identifier: str
    ) -> None:
        with open(self._get_mappings_path(identifier=identifier), mode="w+") as file:
            json.dump(mappings, file, indent=4)
