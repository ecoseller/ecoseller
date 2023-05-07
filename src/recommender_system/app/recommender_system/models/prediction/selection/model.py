from typing import Optional, List

from dependency_injector.wiring import inject, Provide

from recommender_system.models.prediction.abstract import AbstractPredictionModel
from recommender_system.models.stored.product_variant import ProductVariantModel
from recommender_system.storage.abstract import AbstractStorage


class SelectionPredictionModel(AbstractPredictionModel):
    @inject
    def retrieve(
        self, storage: AbstractStorage = Provide["product_storage"]
    ) -> List[str]:
        return storage.get_random_weighted_attribute(
            model_class=ProductVariantModel,
            attribute=ProductVariantModel.Meta.primary_key,
            weight="recommendation_weight",
            limit=1000,
        )

    def score(
        self, variants: List[str], storage: AbstractStorage = Provide["product_storage"]
    ) -> List[str]:
        product_variants = storage.get_objects(
            model_class=ProductVariantModel, pks=variants
        )
        return [
            product_variant.sku
            for product_variant in sorted(
                product_variants, key=lambda x: x.recommendation_weight, reverse=True
            )
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

    @inject
    def predict(
        self,
        session_id: str,
        user_id: Optional[int],
        variants: Optional[List[str]] = None,
        storage: AbstractStorage = Provide["product_storage"],
    ) -> List[str]:
        if variants is not None:
            return variants
        return storage.get_random_weighted_attribute(
            model_class=ProductVariantModel,
            attribute=ProductVariantModel.Meta.primary_key,
            weight="recommendation_weight",
            limit=1000,
        )
