from typing import Optional, List

from dependency_injector.wiring import inject, Provide
import numpy as np

from recommender_system.models.prediction.abstract import AbstractPredictionModel
from recommender_system.models.prediction.similarity.tools import (
    prepare_variants,
    compute_numerical_distances,
    compute_categorical_distances,
)
from recommender_system.storage.abstract import AbstractStorage


class SimilarityPredictionModel(AbstractPredictionModel):
    def delete_distances(self) -> None:
        raise NotImplementedError()

    def save_distances(self, distances: np.ndarray) -> None:
        raise NotImplementedError()

    def train(self) -> None:
        categorical, numerical, categorical_mask, numerical_mask = prepare_variants()
        distances = compute_numerical_distances(variants=numerical, mask=numerical_mask)
        distances += compute_categorical_distances(
            variants=categorical, mask=categorical_mask
        )
        self.save_distances(distances=distances)

    @inject
    def predict(
        self,
        session_id: str,
        user_id: Optional[int],
        variants: Optional[List[str]] = None,
        storage: AbstractStorage = Provide["product_storage"],
    ) -> List[str]:
        raise NotImplementedError()
