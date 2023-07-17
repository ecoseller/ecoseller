from datetime import datetime
import random
import time
from typing import List, Optional, TYPE_CHECKING

from dependency_injector.wiring import inject, Provide
import numpy as np

from recommender_system.models.prediction.abstract import AbstractPredictionModel
from recommender_system.models.prediction.similarity.tools import (
    prepare_variants,
    compute_numerical_distances,
    compute_categorical_distances,
)
from recommender_system.models.stored.model.latest_identifier import (
    LatestIdentifierModel,
)
from recommender_system.models.stored.model.training_statistics import (
    TrainingStatisticsModel,
)
from recommender_system.models.stored.similarity.distance import DistanceModel
from recommender_system.storage.similarity.abstract import AbstractSimilarityStorage
from recommender_system.utils.memory import get_current_memory_usage

if TYPE_CHECKING:
    from recommender_system.managers.model_manager import ModelManager


class SimilarityPredictionModel(AbstractPredictionModel):
    class Meta:
        model_name = "similarity"
        title = "Similarity"

    @property
    def default_identifier(self) -> str:
        return f"{self.Meta.model_name}_{datetime.now().isoformat()}"

    def is_ready(self, session_id: str, user_id: Optional[int]) -> bool:
        try:
            _ = self.get_latest_identifier()
        except LatestIdentifierModel.DoesNotExist:
            return False
        return True

    def is_ready_for_training(self) -> bool:
        return True

    @inject
    def delete_distances(
        self,
        similarity_storage: AbstractSimilarityStorage = Provide["similarity_storage"],
    ) -> None:
        similarity_storage.delete(
            model_class=DistanceModel, model_identifier=self.identifier
        )

    @inject
    def save_distances(
        self,
        distances: np.ndarray,
        product_variant_skus: List[str],
        similarity_storage: AbstractSimilarityStorage = Provide["similarity_storage"],
    ) -> None:
        distance_models = []
        for i in range(len(product_variant_skus)):
            for j in range(i + 1, len(product_variant_skus)):
                distance_models.append(
                    DistanceModel(
                        lhs=product_variant_skus[i],
                        rhs=product_variant_skus[j],
                        distance=distances[i, j],
                        model_identifier=self.identifier,
                    )
                )
        similarity_storage.bulk_create_objects(models=distance_models)

    def train(self) -> None:
        start = time.time()

        train_data = prepare_variants()
        distances = compute_numerical_distances(
            variants=train_data.numerical, mask=train_data.numerical_mask
        )
        if train_data.categorical is not None:
            distances += compute_categorical_distances(
                variants=train_data.categorical, mask=train_data.categorical_mask
            )
        self.delete_distances()
        self.save_distances(
            distances=distances, product_variant_skus=train_data.product_variant_skus
        )

        peak_memory, peak_memory_percentage = get_current_memory_usage()
        end = time.time()

        statistics = TrainingStatisticsModel(
            model_name=self.Meta.model_name,
            model_identifier=self.identifier,
            duration=end - start,
            peak_memory=peak_memory,
            peak_memory_percentage=peak_memory_percentage,
            metrics={},
            hyperparameters={},
        )
        statistics.create()

    def retrieve_homepage(self, session_id: str, user_id: Optional[int]) -> List[str]:
        raise TypeError(
            f"{self.__class__.__name__} can not perform retrieval for homepage recommendations."
        )

    @inject
    def retrieve_product_detail(
        self,
        session_id: str,
        user_id: Optional[int],
        variant: str,
        similarity_storage: AbstractSimilarityStorage = Provide["similarity_storage"],
        model_manager: "ModelManager" = Provide["model_manager"],
    ) -> List[str]:
        return similarity_storage.get_closest_product_variant_skus(
            to=variant, limit=model_manager.config.retrieval_size
        )

    @inject
    def retrieve_cart(
        self,
        session_id: str,
        user_id: Optional[int],
        variants_in_cart: List[str],
        similarity_storage: AbstractSimilarityStorage = Provide["similarity_storage"],
        model_manager: "ModelManager" = Provide["model_manager"],
    ) -> List[str]:
        # TODO: Check if there are variants in cart in model manager
        return similarity_storage.get_closest_product_variant_skus(
            to=random.choice(variants_in_cart),
            limit=model_manager.config.retrieval_size,
        )

    def score_homepage(
        self, session_id: str, user_id: Optional[int], variants: List[str]
    ) -> List[str]:
        raise TypeError(
            f"{self.__class__.__name__} can not perform scoring for homepage recommendations."
        )

    def score_category_list(
        self, session_id: str, user_id: Optional[int], variants: List[str]
    ) -> List[str]:
        raise TypeError(
            f"{self.__class__.__name__} can not perform scoring for category list recommendations."
        )

    @inject
    def score_product_detail(
        self,
        session_id: str,
        user_id: Optional[int],
        variants: List[str],
        variant: str,
        similarity_storage: AbstractSimilarityStorage = Provide["similarity_storage"],
    ) -> List[str]:
        return similarity_storage.get_closest_product_variant_skus(
            to=variant, pks=variants
        )

    @inject
    def score_cart(
        self,
        session_id: str,
        user_id: Optional[int],
        variants: List[str],
        variants_in_cart: List[str],
        similarity_storage: AbstractSimilarityStorage = Provide["similarity_storage"],
    ) -> List[str]:
        # TODO: Check if there are variants in cart in model manager
        return similarity_storage.get_closest_product_variant_skus(
            to=random.choice(variants_in_cart), pks=variants
        )

    @inject
    def delete(
        self,
        similarity_storage: AbstractSimilarityStorage = Provide["similarity_storage"],
    ) -> None:
        similarity_storage.delete(
            model_class=DistanceModel, model_identifier=self.identifier
        )
