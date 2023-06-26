from datetime import datetime
import logging
from typing import List, Optional

from dependency_injector.wiring import inject, Provide

from recommender_system.models.prediction.abstract import AbstractPredictionModel
from recommender_system.models.prediction.ease.ease import EASE
from recommender_system.storage.product.abstract import AbstractProductStorage


class EASEPredictionModel(AbstractPredictionModel):
    ease: EASE

    class Meta:
        model_name = "ease"

    def __init__(self, identifier: Optional[str] = None):
        super().__init__(identifier=identifier)
        try:
            self.ease = EASE.load(identifier=identifier)
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
        self.ease = EASE(identifier=self.identifier)
        self.ease.train()
        self.ease.save(identifier=self.identifier)

    def retrieve_homepage(self, session_id: str, user_id: Optional[int]) -> List[str]:
        if user_id is None:
            raise ValueError(f"Unknown user_id for session_id '{session_id}'.")
        return self.ease.retrieve(user_id=user_id)

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

    def _score(
        self,
        session_id: str,
        user_id: Optional[int],
        variants: List[str],
    ) -> List[str]:
        if user_id is None:
            raise ValueError(f"Unknown user_id for session_id '{session_id}'.")
        return self.ease.predict(user_id=user_id, variants=variants)

    def score_homepage(
        self, session_id: str, user_id: Optional[int], variants: List[str]
    ) -> List[str]:
        return self._score(session_id=session_id, user_id=user_id, variants=variants)

    def score_category_list(
        self, session_id: str, user_id: Optional[int], variants: List[str]
    ) -> List[str]:
        return self._score(session_id=session_id, user_id=user_id, variants=variants)

    def score_product_detail(
        self, session_id: str, user_id: Optional[int], variants: List[str], variant: str
    ) -> List[str]:
        return self._score(session_id=session_id, user_id=user_id, variants=variants)

    def score_cart(
        self,
        session_id: str,
        user_id: Optional[int],
        variants: List[str],
        variants_in_cart: List[str],
    ) -> List[str]:
        return self._score(session_id=session_id, user_id=user_id, variants=variants)

    def delete(self) -> None:
        EASE.delete(identifier=self.identifier)
