from abc import ABC, abstractmethod
from typing import List, Optional


class AbstractPredictionModel(ABC):
    identifier: str

    class Meta:
        model_name: str

    def __init__(self, identifier: Optional[str] = None):
        self.identifier = identifier or self.default_identifier

    @property
    @abstractmethod
    def default_identifier(self) -> str:
        raise NotImplementedError

    @abstractmethod
    def delete(self) -> None:
        raise NotImplementedError()

    @abstractmethod
    def retrieve_homepage(self, session_id: str, user_id: Optional[int]) -> List[str]:
        raise NotImplementedError()

    @abstractmethod
    def retrieve_product_detail(
        self, session_id: str, user_id: Optional[int], variant: str
    ) -> List[str]:
        raise NotImplementedError()

    @abstractmethod
    def retrieve_cart(
        self, session_id: str, user_id: Optional[int], variants_in_cart: List[str]
    ) -> List[str]:
        raise NotImplementedError()

    @abstractmethod
    def score_homepage(
        self, session_id: str, user_id: Optional[int], variants: List[str]
    ) -> List[str]:
        raise NotImplementedError()

    @abstractmethod
    def score_category_list(
        self, session_id: str, user_id: Optional[int], variants: List[str]
    ) -> List[str]:
        raise NotImplementedError()

    @abstractmethod
    def score_product_detail(
        self, session_id: str, user_id: Optional[int], variants: List[str], variant: str
    ) -> List[str]:
        raise NotImplementedError()

    @abstractmethod
    def score_cart(
        self,
        session_id: str,
        user_id: Optional[int],
        variants: List[str],
        variants_in_cart: List[str],
    ) -> List[str]:
        raise NotImplementedError()

    @abstractmethod
    def train(self) -> None:
        raise NotImplementedError()

    @abstractmethod
    def replace_old(self) -> None:
        raise NotImplementedError()
