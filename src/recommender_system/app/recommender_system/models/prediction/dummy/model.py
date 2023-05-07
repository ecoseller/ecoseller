from typing import Optional, List

from dependency_injector.wiring import inject, Provide

from recommender_system.models.prediction.abstract import AbstractPredictionModel
from recommender_system.models.stored.product_variant import ProductVariantModel
from recommender_system.storage.abstract import AbstractStorage


class DummyPredictionModel(AbstractPredictionModel):
    @inject
    def retrieve(
        self, storage: AbstractStorage = Provide["product_storage"]
    ) -> List[str]:
        return storage.get_objects_attribute(
            model_class=ProductVariantModel,
            attribute=ProductVariantModel.Meta.primary_key,
            limit=1000,
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
