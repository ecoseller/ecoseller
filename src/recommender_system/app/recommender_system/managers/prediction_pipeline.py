from enum import Enum
from typing import Any, List, Optional

from dependency_injector.wiring import inject, Provide

from recommender_system.managers.model_manager import ModelManager
from recommender_system.models.stored.product.product_variant import ProductVariantModel
from recommender_system.storage.product.abstract import AbstractProductStorage
from recommender_system.utils.recommendation_type import RecommendationType


class PredictionPipeline:
    class Step(Enum):
        RETRIEVAL = "RETRIEVAL"
        FILTERING = "FILTERING"
        SCORING = "SCORING"
        ORDERING = "ORDERING"

    @inject
    def _retrieve_category(
        self,
        category_id: int,
        product_storage: AbstractProductStorage = Provide["product_storage"],
    ) -> List[str]:
        return product_storage.get_product_variant_skus_in_category(
            category_id=category_id
        )

    @inject
    def _retrieve(
        self,
        recommendation_type: RecommendationType,
        session_id: str,
        user_id: Optional[int],
        model_manager: ModelManager = Provide["model_manager"],
        **kwargs: Any
    ) -> List[str]:
        model = model_manager.get_model(
            recommendation_type=recommendation_type,
            step=PredictionPipeline.Step.RETRIEVAL,
        )
        if recommendation_type == RecommendationType.HOMEPAGE:
            return model.retrieve_homepage(session_id=session_id, user_id=user_id)
        if recommendation_type == RecommendationType.CATEGORY_LIST:
            return self._retrieve_category(category_id=kwargs["category_id"])
        if recommendation_type == RecommendationType.PRODUCT_DETAIL:
            return model.retrieve_product_detail(
                session_id=session_id, user_id=user_id, variant=kwargs["variant"]
            )
        if recommendation_type == RecommendationType.CART:
            return model.retrieve_cart(
                session_id=session_id,
                user_id=user_id,
                variants_in_cart=kwargs["variants_in_cart"],
            )
        raise ValueError("Unknown recommendation type.")

    @inject
    def _score(
        self,
        variants: List[str],
        recommendation_type: RecommendationType,
        session_id: str,
        user_id: Optional[int],
        model_manager: ModelManager = Provide["model_manager"],
        **kwargs: Any
    ) -> List[str]:
        model = model_manager.get_model(
            recommendation_type=recommendation_type,
            step=PredictionPipeline.Step.SCORING,
        )
        if recommendation_type == RecommendationType.HOMEPAGE:
            return model.score_homepage(
                session_id=session_id, user_id=user_id, variants=variants
            )
        if recommendation_type == RecommendationType.CATEGORY_LIST:
            return model.score_category_list(
                session_id=session_id, user_id=user_id, variants=variants
            )
        if recommendation_type == RecommendationType.PRODUCT_DETAIL:
            return model.score_product_detail(
                session_id=session_id,
                user_id=user_id,
                variants=variants,
                variant=kwargs["variant"],
            )
        if recommendation_type == RecommendationType.CART:
            return model.score_cart(
                session_id=session_id,
                user_id=user_id,
                variants=variants,
                variants_in_cart=kwargs["variants_in_cart"],
            )
        raise ValueError("Unknown recommendation type.")

    def _order(
        self,
        variants: List[str],
        recommendation_type: RecommendationType,
        session_id: str,
        user_id: Optional[int],
    ) -> List[str]:
        variant_models = [ProductVariantModel.get(pk=variant) for variant in variants]
        variant_models.sort(key=lambda variant: variant.create_at, reverse=True)
        return [variant.pk for variant in variant_models]

    def run(
        self,
        recommendation_type: RecommendationType,
        session_id: str,
        user_id: Optional[int],
    ) -> List[str]:
        predictions = self._retrieve(
            recommendation_type=recommendation_type,
            session_id=session_id,
            user_id=user_id,
        )
        predictions = self._score(
            variants=predictions,
            recommendation_type=recommendation_type,
            session_id=session_id,
            user_id=user_id,
        )
        predictions = self._order(
            variants=predictions,
            recommendation_type=recommendation_type,
            session_id=session_id,
            user_id=user_id,
        )
        return predictions
