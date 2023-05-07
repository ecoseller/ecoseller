from typing import Optional, List

from dependency_injector.wiring import inject, Provide

from recommender_system.models.prediction.abstract import AbstractPredictionModel
from recommender_system.storage.abstract import AbstractStorage


class PopularityPredictionModel(AbstractPredictionModel):
    @inject
    def retrieve(
        self, storage: AbstractStorage = Provide["product_storage"]
    ) -> List[str]:
        return storage.get_popular_product_variant_pks(limit=1000)

    def score(
        self, variants: List[str], storage: AbstractStorage = Provide["product_storage"]
    ) -> List[str]:
        popularities = storage.get_product_variant_popularities(pks=variants)
        return [
            sku for sku, _ in sorted(popularities, key=lambda x: x[1], reverse=True)
        ]

    def retrieve_homepage(self, session_id: str, user_id: Optional[int]) -> List[str]:
        return self.retrieve()

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
