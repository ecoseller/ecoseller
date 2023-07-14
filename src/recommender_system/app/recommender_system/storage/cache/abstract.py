from abc import ABC, abstractmethod
from typing import Dict, List, Optional


class AbstractCacheStorage(ABC):
    """
    Base class for cache storage to define its functionality.

    """

    size: int
    last_used: Dict[str, bool]

    def __init__(self, size: int):
        self.size = size
        self.last_used = {}

    def _get_key(self, session_id: str, category_id: int) -> str:
        return f"{category_id}_{session_id}"

    def _update_last_used(self, session_id: str, category_id: int) -> None:
        key = self._get_key(session_id=session_id, category_id=category_id)
        _ = self.last_used.pop(key, None)
        self.last_used[key] = True

    def _add_last_used(self, session_id: str, category_id: int) -> None:
        self._update_last_used(session_id=session_id, category_id=category_id)
        if len(self.last_used) > self.size:
            for key in self.last_used:
                _ = self.last_used.pop(key)
                break

    @abstractmethod
    def get_category_list(
        self, session_id: str, category_id: int
    ) -> Optional[List[str]]:
        raise NotImplementedError()

    @abstractmethod
    def store_category_list(
        self, session_id: str, category_id: int, category_list: List[str]
    ) -> None:
        raise NotImplementedError()
