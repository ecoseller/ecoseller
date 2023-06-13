import json
import os
from typing import Dict

import torch

from recommender_system.storage.gru4rec.abstract import AbstractGRU4RecStorage


class FileGRU4RecStorage(AbstractGRU4RecStorage):
    directory: str

    def __init__(self, directory: str):
        self.directory = directory

    def _get_module_path(self, identifier: str) -> str:
        return os.path.join(self.directory, f"{identifier}_module.pt")

    def _get_mapping_path(self, identifier: str) -> str:
        return os.path.join(self.directory, f"{identifier}_mapping.json")

    def get_module(self, identifier: str) -> torch.nn.Module:
        module = torch.load(self._get_module_path(identifier=identifier))
        module.eval()
        return module

    def get_mapping(self, identifier: str) -> Dict[str, int]:
        with open(self._get_mapping_path(identifier=identifier), mode="r") as file:
            return json.load(file)

    def delete_module(self, identifier: str) -> None:
        os.remove(self._get_module_path(identifier=identifier))

    def delete_mapping(self, identifier: str) -> None:
        os.remove(self._get_mapping_path(identifier=identifier))

    def store_module(self, module: torch.nn.Module, identifier: str) -> None:
        torch.save(module, self._get_module_path(identifier=identifier))

    def store_mapping(self, mapping: Dict[str, int], identifier: str) -> None:
        with open(self._get_mapping_path(identifier=identifier), mode="w+") as file:
            json.dump(mapping, file, indent=4)
