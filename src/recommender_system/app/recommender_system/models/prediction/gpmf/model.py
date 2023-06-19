from datetime import datetime
import logging
from typing import List, Optional

from dependency_injector.wiring import inject, Provide

from recommender_system.models.prediction.abstract import AbstractPredictionModel
from recommender_system.models.prediction.gpmf.gpmf import GPMF
from recommender_system.storage.product.abstract import AbstractProductStorage


class GPMFPredictionModel(AbstractPredictionModel):
    class Meta:
        model_name = "gpmf"

    def __init__(self, identifier: Optional[str] = None):
        super().__init__(identifier=identifier)
        try:
            self.gpmf = GPMF.load(identifier=identifier)
        except Exception as e:
            logging.warning(
                f"Unable to load model {self.Meta.model_name}: {self.identifier} ({e})"
            )

    @property
    def default_identifier(self) -> str:
        return f"{self.Meta.model_name}_{datetime.now().isoformat()}"

    @inject
    def train(
        self, product_storage: AbstractProductStorage = Provide["product_storage"]
    ) -> None:
        self.gpmf = GPMF()
        self.gpmf.train()
        self.gpmf.save(identifier=self.identifier)

    def retrieve_homepage(self, session_id: str, user_id: Optional[int]) -> List[str]:
        raise NotImplementedError()

    def retrieve_product_detail(
        self, session_id: str, user_id: Optional[int], variant: str
    ) -> List[str]:
        raise TypeError(
            f"{self.__class__.__name__} can not perform retrieval for product detail recommendations."
        )

    def retrieve_cart(
        self, session_id: str, user_id: Optional[int], variants_in_cart: List[str]
    ) -> List[str]:
        raise TypeError(
            f"{self.__class__.__name__} can not perform retrieval for cart recommendations."
        )

    def _score(self, user_id: int, variants: List[str]) -> List[str]:
        return self.gpmf.predict(user_id=user_id, variants=variants)

    def score_homepage(
        self, session_id: str, user_id: Optional[int], variants: List[str]
    ) -> List[str]:
        if user_id is None:
            raise ValueError(f"Unknown user ID for session {session_id}")
        return self._score(user_id=user_id, variants=variants)

    def score_category_list(
        self, session_id: str, user_id: Optional[int], variants: List[str]
    ) -> List[str]:
        if user_id is None:
            raise ValueError(f"Unknown user ID for session {session_id}")
        return self._score(user_id=user_id, variants=variants)

    def score_product_detail(
        self, session_id: str, user_id: Optional[int], variants: List[str], variant: str
    ) -> List[str]:
        if user_id is None:
            raise ValueError(f"Unknown user ID for session {session_id}")
        return self._score(user_id=user_id, variants=variants)

    def score_cart(
        self,
        session_id: str,
        user_id: Optional[int],
        variants: List[str],
        variants_in_cart: List[str],
    ) -> List[str]:
        if user_id is None:
            raise ValueError(f"Unknown user ID for session {session_id}")
        return self._score(user_id=user_id, variants=variants)

    def delete(self) -> None:
        if hasattr(self, "gpmf"):
            self.gpmf.delete(identifier=self.identifier)
