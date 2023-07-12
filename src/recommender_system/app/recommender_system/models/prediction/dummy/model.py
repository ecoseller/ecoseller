from typing import Optional, List, TYPE_CHECKING

from dependency_injector.wiring import inject, Provide

from recommender_system.models.prediction.abstract import AbstractPredictionModel
from recommender_system.models.stored.product.product_variant import ProductVariantModel
from recommender_system.storage.product.abstract import AbstractProductStorage

if TYPE_CHECKING:
    from recommender_system.managers.model_manager import ModelManager


class DummyPredictionModel(AbstractPredictionModel):
    class Meta:
        model_name = "dummy"
        title = "Dummy"

    @property
    def default_identifier(self) -> str:
        return self.Meta.model_name

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
