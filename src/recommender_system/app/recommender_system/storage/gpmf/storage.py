import json
import os
from typing import Dict

import numpy as np

from recommender_system.storage.gpmf.abstract import AbstractGPMFStorage


class FileGPMFStorage(AbstractGPMFStorage):
    directory: str

    def __init__(self, directory: str):
        self.directory = directory

    def _get_matrices_path(self, identifier: str) -> str:
        return os.path.join(self.directory, f"{identifier}_matrices.npz")

    def _get_mappings_path(self, identifier: str) -> str:
        return os.path.join(self.directory, f"{identifier}_mappings.json")

    def get_matrices(self, identifier: str) -> Dict[str, np.ndarray]:
        return np.load(self._get_matrices_path(identifier=identifier))

    def get_mappings(self, identifier: str) -> Dict[str, dict]:
        with open(self._get_mappings_path(identifier=identifier), mode="r") as file:
            return json.load(file)

    def delete_matrices(self, identifier: str) -> None:
        os.remove(self._get_matrices_path(identifier=identifier))

    def delete_mappings(self, identifier: str) -> None:
        os.remove(self._get_mappings_path(identifier=identifier))

    def store_matrices(self, matrices: Dict[str, np.ndarray], identifier: str) -> None:
        np.savez(file=self._get_matrices_path(identifier=identifier), **matrices)

    def store_mappings(self, mappings: Dict[str, dict], identifier: str) -> None:
        with open(self._get_mappings_path(identifier=identifier), mode="w+") as file:
            json.dump(mappings, file, indent=4)
