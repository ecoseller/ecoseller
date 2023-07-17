import pickle
import os
from typing import List, Optional

from recommender_system.storage.cache.abstract import AbstractCacheStorage


class FileCacheStorage(AbstractCacheStorage):
    directory: str

    def __init__(self, directory: str, size: int):
        super().__init__(size=size)
        self.directory = directory

    def _get_filename(self, session_id: str, category_id: int) -> str:
        return os.path.join(
            self.directory,
            f"{self._get_key(session_id=session_id, category_id=category_id)}.pickle",
        )

    def get_category_list(
        self, session_id: str, category_id: int
    ) -> Optional[List[str]]:
        self._update_last_used(session_id=session_id, category_id=category_id)
        filename = self._get_filename(session_id=session_id, category_id=category_id)
        try:
            with open(filename, mode="rb") as file:
                return pickle.load(file)
        except OSError:
            return None

    def store_category_list(
        self, session_id: str, category_id: int, category_list: List[str]
    ) -> None:
        self._add_last_used(session_id=session_id, category_id=category_id)
        filename = self._get_filename(session_id=session_id, category_id=category_id)
        with open(filename, mode="wb+") as file:
            pickle.dump(category_list, file)
