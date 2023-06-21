from enum import Enum
from typing import Any, List, Optional

from dependency_injector.wiring import inject, Provide
import numpy as np

from recommender_system.managers.model_manager import ModelManager
from recommender_system.models.prediction.similarity.model import (
    SimilarityPredictionModel,
)
from recommender_system.models.stored.product.product_variant import ProductVariantModel
from recommender_system.models.stored.similarity.distance import DistanceModel
from recommender_system.storage.product.abstract import AbstractProductStorage
from recommender_system.utils.recommendation_type import RecommendationType


class PredictionPipeline:
    order_top_k: int = 50

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

    def _order_by_diversity(self, variants: List[str]) -> List[str]:
        def intra_list_distance(indices: List[int], dists: np.ndarray) -> float:
            return np.mean(dists[np.ix_(indices, indices)]).item()

        top_k = variants
        left_out = []
        if self.order_top_k < len(variants):
            top_k = variants[: self.order_top_k]
            left_out = variants[self.order_top_k :]
        model_identifier = SimilarityPredictionModel.get_latest_identifier()
        mapping = {sku: i for i, sku in enumerate(top_k)}
        distances = DistanceModel.gets(
            model_identifier=model_identifier, lhs__in=top_k, rhs__in=top_k
        )
        distance_matrix = np.zeros((len(top_k), len(top_k)))

        for distance in distances:
            i = mapping[distance.lhs]
            j = mapping[distance.rhs]
            distance_matrix[i, j] = distance.distance

        result = [top_k[0]]
        rest = set(top_k[1:])
        while len(rest) > 0:
            mapped_result = [mapping[sku] for sku in result]
            best_sku: Optional[str] = None
            best: Optional[float] = None
            for sku in rest:
                ild = intra_list_distance(
                    indices=mapped_result + [mapping[sku]], dists=distance_matrix
                )
                if best is None or ild > best:
                    best_sku = sku
                    best = ild
            result.append(best_sku)
            rest.remove(best_sku)

        return result + left_out

    @inject
    def _order_by_stock(
        self,
        variants: List[str],
        product_storage: AbstractProductStorage = Provide["product_storage"],
    ) -> List[str]:
        out_of_stock_set = set(
            product_storage.get_objects_attribute(
                model_class=ProductVariantModel,
                attribute="sku",
                stock_quantity=0,
                sku__in=variants,
            )
        )
        in_stock = [variant for variant in variants if variant not in out_of_stock_set]
        out_of_stock = [variant for variant in variants if variant in out_of_stock_set]
        return in_stock + out_of_stock

    def _order(
        self,
        variants: List[str],
        recommendation_type: RecommendationType,
        session_id: str,
        user_id: Optional[int],
    ) -> List[str]:
        result = self._order_by_diversity(variants=variants)
        result = self._order_by_stock(variants=result)
        return result

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
