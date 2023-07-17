from datetime import datetime
import logging
from typing import List, Optional, TYPE_CHECKING

from dependency_injector.wiring import inject, Provide

from recommender_system.models.prediction.abstract import AbstractPredictionModel
from recommender_system.models.prediction.ease.ease import EASE
from recommender_system.models.stored.feedback.review import ReviewModel
from recommender_system.models.stored.product.product_variant import ProductVariantModel
from recommender_system.storage.ease.abstract import AbstractEASEStorage
from recommender_system.storage.feedback.abstract import AbstractFeedbackStorage
from recommender_system.storage.product.abstract import AbstractProductStorage

if TYPE_CHECKING:
    from recommender_system.managers.model_manager import ModelManager


class EASEPredictionModel(AbstractPredictionModel):
    ease: EASE

    class Meta:
        model_name = "ease"
        title = "EASE"

    def __init__(self, identifier: Optional[str] = None):
        super().__init__(identifier=identifier)
        try:
            self.ease = EASE.load(identifier=self.identifier)
        except Exception as e:
            logging.warning(
                f"Unable to load model {self.Meta.model_name}: {self.identifier} ({e})"
            )

    @property
    def default_identifier(self) -> str:
        return f"{self.Meta.model_name}_{datetime.now().isoformat()}"

    @classmethod
    @inject
    def is_ready(
        cls,
        session_id: str,
        user_id: Optional[int],
        ease_storage: AbstractEASEStorage = Provide["ease_storage"],
    ) -> bool:
        if user_id is None:
            return False

        try:
            user_mapping = ease_storage.get_mappings(cls.get_latest_identifier())[
                "user_mapping"
            ]
        except Exception:
            return False

        return user_id in user_mapping

    @classmethod
    @inject
    def is_ready_for_training(
        cls,
        model_manager: "ModelManager" = Provide["model_manager"],
        feedback_storage: AbstractFeedbackStorage = Provide["feedback_storage"],
        product_storage: AbstractProductStorage = Provide["product_storage"],
    ) -> bool:
        return feedback_storage.count_objects(
            model_class=ReviewModel
        ) > model_manager.config.ease_config.reviews_multiplier * product_storage.count_objects(
            model_class=ProductVariantModel
        )

    @inject
    def train(
        self, product_storage: AbstractProductStorage = Provide["product_storage"]
    ) -> None:
        if not self.is_ready_for_training():
            logging.info(
                f"Skipping training of model {self.Meta.model_name}. Model is not ready."
            )
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
