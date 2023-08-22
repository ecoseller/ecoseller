from datetime import datetime
import logging
from typing import Any, List, Optional, TYPE_CHECKING

from dependency_injector.wiring import inject, Provide

from recommender_system.models.prediction.gru4rec.neural_network import NeuralNetwork
from recommender_system.models.prediction.abstract import AbstractPredictionModel
from recommender_system.models.stored.feedback.product_detail_enter import (
    ProductDetailEnterModel,
)
from recommender_system.models.stored.feedback.session import SessionModel
from recommender_system.models.stored.model.latest_identifier import (
    LatestIdentifierModel,
)
from recommender_system.models.stored.product.product_variant import ProductVariantModel
from recommender_system.storage.feedback.abstract import AbstractFeedbackStorage
from recommender_system.storage.product.abstract import AbstractProductStorage
from recommender_system.utils.recommendation_type import RecommendationType

if TYPE_CHECKING:
    from recommender_system.managers.model_manager import ModelManager


class GRU4RecPredictionModel(AbstractPredictionModel):
    network: NeuralNetwork

    class Meta:
        model_name = "gru4rec"
        title = "GRU4Rec"

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

    @classmethod
    def is_ready(
        cls,
        recommendation_type: RecommendationType,
        session_id: str,
        user_id: Optional[int],
        **kwargs: Any,
    ) -> bool:
        try:
            _ = cls.get_latest_identifier()
        except LatestIdentifierModel.DoesNotExist:
            return False

        try:
            visited_variants = SessionModel.get(pk=session_id).visited_product_variants
        except SessionModel.DoesNotExist:
            return False

        return len(visited_variants) > 0

    @classmethod
    @inject
    def is_ready_for_training(
        cls,
        model_manager: "ModelManager" = Provide["model_manager"],
        feedback_storage: AbstractFeedbackStorage = Provide["feedback_storage"],
        product_storage: AbstractProductStorage = Provide["product_storage"],
    ) -> bool:
        return feedback_storage.count_objects(
            model_class=ProductDetailEnterModel
        ) > model_manager.config.gru4rec_config.events_multiplier * product_storage.count_objects(
            model_class=ProductVariantModel
        )

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
