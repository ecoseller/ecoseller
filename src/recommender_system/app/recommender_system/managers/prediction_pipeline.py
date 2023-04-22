from enum import Enum
from typing import List, Optional

from dependency_injector.wiring import inject, Provide

from recommender_system.managers.model_manager import ModelManager
from recommender_system.models.stored.product_variant import ProductVariantModel
from recommender_system.utils.recommendation_type import RecommendationType


class PredictionPipeline:
    class Step(Enum):
        RETRIEVAL = "RETRIEVAL"
        FILTERING = "FILTERING"
        SCORING = "SCORING"
        ORDERING = "ORDERING"

    @inject
    def _retrieve(
        self,
        recommendation_type: RecommendationType,
        session_id: str,
        user_id: Optional[int],
        model_manager: ModelManager = Provide["model_manager"],
    ) -> List[str]:
        model = model_manager.get_model(
            recommendation_type=recommendation_type,
            step=PredictionPipeline.Step.FILTERING,
        )
        return model.predict(session_id=session_id, user_id=user_id)

    def _filter(
        self,
        variants: List[str],
        recommendation_type: RecommendationType,
        session_id: str,
        user_id: Optional[int],
    ) -> List[str]:
        return variants

    @inject
    def _score(
        self,
        variants: List[str],
        recommendation_type: RecommendationType,
        session_id: str,
        user_id: Optional[int],
        model_manager: ModelManager = Provide["model_manager"],
    ) -> List[str]:
        model = model_manager.get_model(
            recommendation_type=recommendation_type,
            step=PredictionPipeline.Step.FILTERING,
        )
        return model.predict(session_id=session_id, user_id=user_id, variants=variants)

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
        predictions = self._filter(
            variants=predictions,
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
