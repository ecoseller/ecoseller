from typing import Any, Optional, List, TYPE_CHECKING

from dependency_injector.wiring import inject, Provide

from recommender_system.models.prediction.abstract import AbstractPredictionModel
from recommender_system.models.stored.product.product_variant import ProductVariantModel
from recommender_system.storage.product.abstract import AbstractProductStorage
from recommender_system.utils.recommendation_type import RecommendationType

if TYPE_CHECKING:
    from recommender_system.managers.model_manager import ModelManager


class DummyPredictionModel(AbstractPredictionModel):
    class Meta:
        model_name = "dummy"
        title = "Dummy"
        description = """Dummy prediction model is the simplest implemented model, it can perform retrieval and scoring.
        It selects product variants from the database without any ordering during retrieval. Scoring step does not
        reorder the product variants in any way. It keeps the order the same as the retrieval step provided. This model
        is used when all of the other models fail, it is not included in any cascade. 
        """

    @property
    def default_identifier(self) -> str:
        return self.Meta.model_name

    @classmethod
    def is_ready(
        cls,
        recommendation_type: RecommendationType,
        session_id: str,
        user_id: Optional[int],
        **kwargs: Any
    ) -> bool:
        return True

    @classmethod
    def can_be_trained(cls) -> bool:
        return False

    @classmethod
    def is_ready_for_training(cls) -> bool:
        return False

    @classmethod
    def get_latest_identifier(cls) -> str:
        return cls().default_identifier

    @inject
    def retrieve(
        self,
        storage: AbstractProductStorage = Provide["product_storage"],
        model_manager: "ModelManager" = Provide["model_manager"],
    ) -> List[str]:
        return storage.get_objects_attribute(
            model_class=ProductVariantModel,
            attribute=ProductVariantModel.Meta.primary_key,
            stock_quantity__gt=0,
            limit=model_manager.config.retrieval_size,
        )

    def score(self, variants: List[str]) -> List[str]:
        return variants

    def retrieve_homepage(self, session_id: str, user_id: Optional[int]) -> List[str]:
        return self.retrieve()

    def retrieve_product_detail(
        self, session_id: str, user_id: Optional[int], variant: str
    ) -> List[str]:
        return self.retrieve()

    def retrieve_cart(
        self, session_id: str, user_id: Optional[int], variants_in_cart: List[str]
    ) -> List[str]:
        return self.retrieve()

    def score_homepage(
        self, session_id: str, user_id: Optional[int], variants: List[str]
    ) -> List[str]:
        return self.score(variants=variants)

    def score_category_list(
        self, session_id: str, user_id: Optional[int], variants: List[str]
    ) -> List[str]:
        return self.score(variants=variants)

    def score_product_detail(
        self, session_id: str, user_id: Optional[int], variants: List[str], variant: str
    ) -> List[str]:
        return self.score(variants=variants)

    def score_cart(
        self,
        session_id: str,
        user_id: Optional[int],
        variants: List[str],
        variants_in_cart: List[str],
    ) -> List[str]:
        return self.score(variants=variants)

    def train(self) -> None:
        pass

    def replace_old(self) -> None:
        pass

    def delete(self) -> None:
        pass
