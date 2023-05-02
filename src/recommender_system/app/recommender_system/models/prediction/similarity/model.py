from typing import List, Optional

from dependency_injector.wiring import inject, Provide
import numpy as np

from recommender_system.models.prediction.abstract import AbstractPredictionModel
from recommender_system.models.prediction.similarity.tools import (
    prepare_variants,
    compute_numerical_distances,
    compute_categorical_distances,
)
from recommender_system.models.stored.distance import DistanceModel
from recommender_system.storage.abstract import AbstractStorage


class SimilarityPredictionModel(AbstractPredictionModel):
    @inject
    def delete_distances(
        self, similarity_storage: AbstractStorage = Provide["similarity_storage"]
    ) -> None:
        similarity_storage.delete(model_class=DistanceModel)

    @inject
    def save_distances(
        self,
        distances: np.ndarray,
        product_variant_skus: List[str],
        similarity_storage: AbstractStorage = Provide["similarity_storage"],
    ) -> None:
        distance_models = []
        for i in range(len(product_variant_skus)):
            for j in range(i + 1, len(product_variant_skus)):
                distance_models.append(
                    DistanceModel(
                        lhs=product_variant_skus[i],
                        rhs=product_variant_skus[j],
                        distance=distances[i, j],
                    )
                )
        similarity_storage.bulk_create_objects(models=distance_models)

    def train(self) -> None:
        train_data = prepare_variants()
        distances = compute_numerical_distances(
            variants=train_data.numerical, mask=train_data.numerical_mask
        )
        distances += compute_categorical_distances(
            variants=train_data.categorical, mask=train_data.categorical_mask
        )
        self.delete_distances()
        self.save_distances(
            distances=distances, product_variant_skus=train_data.product_variant_skus
        )

    @inject
    def predict(
        self,
        session_id: str,
        user_id: Optional[int],
        variants: Optional[List[str]] = None,
        storage: AbstractStorage = Provide["product_storage"],
    ) -> List[str]:
        raise NotImplementedError()
