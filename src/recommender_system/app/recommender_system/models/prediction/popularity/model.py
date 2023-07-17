from typing import Optional, List, TYPE_CHECKING

from dependency_injector.wiring import inject, Provide

from recommender_system.models.prediction.abstract import AbstractPredictionModel
from recommender_system.models.stored.product.order import OrderModel
from recommender_system.models.stored.product.product_variant import ProductVariantModel
from recommender_system.storage.product.abstract import AbstractProductStorage

if TYPE_CHECKING:
    from recommender_system.managers.model_manager import ModelManager


class PopularityPredictionModel(AbstractPredictionModel):
    class Meta:
        model_name = "popularity"
        title = "Popularity"

    @property
    def default_identifier(self) -> str:
        return self.Meta.model_name

    @inject
    def is_ready(
        self,
        session_id: str,
        user_id: Optional[int],
        product_storage: AbstractProductStorage = Provide["product_storage"],
    ) -> bool:
        return product_storage.count_objects(
            model_class=OrderModel
        ) > product_storage.count_objects(model_class=ProductVariantModel)

    def is_ready_for_training(self) -> bool:
        return False

    @inject
    def retrieve(
        self,
        storage: AbstractProductStorage = Provide["product_storage"],
        model_manager: "ModelManager" = Provide["model_manager"],
    ) -> List[str]:
        return storage.get_popular_product_variant_skus(
            filter_in_stock=True, limit=model_manager.config.retrieval_size
        )

    def score(
        self,
        variants: List[str],
        storage: AbstractProductStorage = Provide["product_storage"],
    ) -> List[str]:
        popularities = storage.get_product_variant_popularities(skus=variants)
        return [sku for sku in sorted(popularities.keys(), reverse=True)]

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

    def train(self) -> None:
        pass

    def replace_old(self) -> None:
        pass

    def delete(self) -> None:
        pass
