from abc import ABC, abstractmethod
from typing import List, Optional


class AbstractPredictionModel(ABC):
    @abstractmethod
    def predict(
        self,
        session_id: str,
        user_id: Optional[int],
        variants: Optional[List[str]] = None,
    ) -> List[str]:
        raise NotImplementedError()
