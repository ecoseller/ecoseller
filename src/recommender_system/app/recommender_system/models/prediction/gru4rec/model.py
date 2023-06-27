from datetime import datetime
import logging
from typing import List, Optional

from dependency_injector.wiring import inject, Provide

from recommender_system.models.prediction.gru4rec.neural_network import NeuralNetwork
from recommender_system.models.prediction.abstract import AbstractPredictionModel
from recommender_system.models.stored.product.product_variant import ProductVariantModel
from recommender_system.storage.product.abstract import AbstractProductStorage


class GRU4RecPredictionModel(AbstractPredictionModel):
    network: NeuralNetwork

    class Meta:
        model_name = "gru4rec"

    def __init__(self, identifier: Optional[str] = None):
        super().__init__(identifier=identifier)
        try:
            self.network = NeuralNetwork.load(identifier=self.identifier)
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
        num_product_variants = product_storage.count_objects(
            model_class=ProductVariantModel
        )
        self.network = NeuralNetwork(
            identifier=self.identifier, num_product_variants=num_product_variants
        )
        self.network.train()
        self.network.save(identifier=self.identifier)

    def retrieve_homepage(self, session_id: str, user_id: Optional[int]) -> List[str]:
        raise TypeError(
            f"{self.__class__.__name__} can not perform retrieval for homepage recommendations."
        )

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

    def _score(self, session_id: str, variants: List[str]) -> List[str]:
        return self.network.predict(session_id=session_id, variants=variants)

    def score_homepage(
        self, session_id: str, user_id: Optional[int], variants: List[str]
    ) -> List[str]:
        return self._score(session_id=session_id, variants=variants)

    def score_category_list(
        self, session_id: str, user_id: Optional[int], variants: List[str]
    ) -> List[str]:
        return self._score(session_id=session_id, variants=variants)

    def score_product_detail(
        self, session_id: str, user_id: Optional[int], variants: List[str], variant: str
    ) -> List[str]:
        return self._score(session_id=session_id, variants=variants)

    def score_cart(
        self,
        session_id: str,
        user_id: Optional[int],
        variants: List[str],
        variants_in_cart: List[str],
    ) -> List[str]:
        return self._score(session_id=session_id, variants=variants)

    def delete(self) -> None:
        NeuralNetwork.delete(identifier=self.identifier)
