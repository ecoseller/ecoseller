from typing import Optional, List, TYPE_CHECKING

from dependency_injector.wiring import inject, Provide

from recommender_system.models.prediction.abstract import AbstractPredictionModel
from recommender_system.models.stored.product.product_variant import ProductVariantModel
from recommender_system.storage.product.abstract import AbstractProductStorage

if TYPE_CHECKING:
    from recommender_system.managers.model_manager import ModelManager


class SelectionPredictionModel(AbstractPredictionModel):
    class Meta:
        model_name = "selection"

    @property
    def default_identifier(self) -> str:
        return "selection"

    @inject
    def retrieve(
        self,
        storage: AbstractProductStorage = Provide["product_storage"],
        model_manager: "ModelManager" = Provide["model_manager"],
    ) -> List[str]:
        return storage.get_random_weighted_attribute(
            model_class=ProductVariantModel,
            attribute=ProductVariantModel.Meta.primary_key,
            weight="recommendation_weight",
            stock_quantity__gt=0,
            limit=model_manager.config.retrieval_size,
        )

    def score(
        self,
        variants: List[str],
        storage: AbstractProductStorage = Provide["product_storage"],
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
        storage: AbstractProductStorage = Provide["product_storage"],
        model_manager: "ModelManager" = Provide["model_manager"],
    ) -> List[str]:
        if variants is not None:
            return variants
        return storage.get_random_weighted_attribute(
            model_class=ProductVariantModel,
            attribute=ProductVariantModel.Meta.primary_key,
            weight="recommendation_weight",
            limit=model_manager.config.retrieval_size,
        )

    def train(self) -> None:
        pass

    def replace_old(self) -> None:
        pass

    def delete(self) -> None:
        pass
