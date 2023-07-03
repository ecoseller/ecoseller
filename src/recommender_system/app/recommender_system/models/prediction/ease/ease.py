import logging
import math
import time
from typing import Any, Dict, List, Optional, Tuple, TYPE_CHECKING

import numpy as np
from dependency_injector.wiring import inject, Provide

# from recommender_system.models.stored.feedback.product_add_to_cart import (
#     ProductAddToCartModel,
# )
from recommender_system.models.stored.feedback.review import ReviewModel
from recommender_system.models.stored.model.config import ConfigModel
from recommender_system.models.stored.model.training_statistics import (
    TrainingStatisticsModel,
)
from recommender_system.models.stored.product.product_variant import ProductVariantModel
from recommender_system.storage.ease.abstract import AbstractEASEStorage
from recommender_system.storage.product.abstract import AbstractProductStorage
from recommender_system.utils.memory import get_current_memory_usage

if TYPE_CHECKING:
    from recommender_system.managers.model_manager import ModelManager


class EASE:
    l2: float = 10

    X: np.ndarray
    B: np.ndarray

    user_mapping: Dict[str, int]
    product_variant_mapping: Dict[str, int]
    inverse_variant_mapping: Dict[int, str]

    model_identifier: str

    @property
    def model_name(self) -> str:
        from recommender_system.models.prediction.ease.model import EASEPredictionModel

        return EASEPredictionModel.Meta.model_name

    @property
    def parameters(self) -> Dict[str, Any]:
        return {"l2": self.l2}

    def __init__(self, identifier: str):
        self.model_identifier = identifier

    @classmethod
    @inject
    def load(
        cls,
        identifier: str,
        ease_storage: AbstractEASEStorage = Provide["ease_storage"],
    ) -> "EASE":
        ease = cls(identifier=identifier)

        matrices = ease_storage.get_matrices(identifier=identifier)
        ease.X = matrices["X"]
        ease.B = matrices["B"]

        parameters = ease_storage.get_parameters(identifier=identifier)
        ease._set_parameters(parameters=parameters)

        mappings = ease_storage.get_mappings(identifier=identifier)
        ease.user_mapping = mappings["user_mapping"]
        ease.product_variant_mapping = mappings["product_variant_mapping"]
        ease._update_inverse_mapping()

        return ease

    def _update_inverse_mapping(self) -> None:
        self.inverse_variant_mapping = {
            value: key for key, value in self.product_variant_mapping.items()
        }

    def _get_mappings(self) -> Dict[str, Dict[str, int]]:
        return {
            "user_mapping": self.user_mapping,
            "product_variant_mapping": self.product_variant_mapping,
        }

    def _get_matrices(self) -> Dict[str, np.ndarray]:
        return {"X": self.X, "B": self.B}

    @property
    def possible_parameters(self) -> List[Dict[str, Any]]:
        parameters = []
        config = ConfigModel.get_current()
        for l2 in config.ease_config.l2_options:
            parameters.append({"l2": l2})
        return parameters

    def _set_parameters(self, parameters: Optional[Dict[str, Any]]) -> None:
        if parameters is None:
            return
        for key, value in parameters:
            setattr(self, key, value)

    def _fit(
        self,
        X_size: Tuple[int, int],
        reviews: List[ReviewModel],
        peak_memory: float,
        peak_memory_percentage: float,
    ) -> Tuple[float, float]:
        self.X = np.zeros(X_size, dtype=np.double)
        for review in reviews:
            if review.product_variant_sku not in self.product_variant_mapping:
                continue
            user = self.user_mapping[str(review.user_id)]
            product_variant = self.product_variant_mapping[review.product_variant_sku]
            # self.X[user, product_variant] = review.rating
            self.X[user, product_variant] = 1

        logging.info("Computing matrix B")

        G = self.X.T @ self.X
        diag = np.diag_indices(G.shape[0])
        G[diag] += self.l2
        P = np.linalg.inv(G)
        self.B = P / (-np.diag(P))
        self.B[diag] = 0

        memory, memory_percentage = get_current_memory_usage()
        if memory > peak_memory:
            peak_memory, peak_memory_percentage = memory, memory_percentage

        return peak_memory, peak_memory_percentage

    def _evaluate(
        self,
        user_indices: List[int],
        variant_indices: List[int],
        peak_memory: float,
        peak_memory_percentage: float,
    ) -> Tuple[float, float, float]:
        X = self.X[np.ix_(user_indices, variant_indices)]
        B = self.B[
            np.ix_(variant_indices, variant_indices)
        ]  # Submatrix induced by rows and cols `variant_indices`

        scores = X @ B
        scores_min = np.min(scores)
        scores_max = np.max(scores)
        if scores_min == scores_max:
            normalized_scores = np.full(scores.shape, 0.5)
        else:
            normalized_scores = (scores - scores_min) / (scores_max - scores_min)
        errors = (X - normalized_scores) * (X - normalized_scores)

        memory, memory_percentage = get_current_memory_usage()
        if memory > peak_memory:
            peak_memory, peak_memory_percentage = memory, memory_percentage

        return peak_memory, peak_memory_percentage, np.mean(errors).item()

    @inject
    def train(
        self, product_storage: AbstractProductStorage = Provide["product_storage"]
    ) -> None:
        logging.info("Training started")

        start = time.time()
        peak_memory, peak_memory_percentage = get_current_memory_usage()

        logging.info("Preparing rating matrix")

        # TODO: Use better rating matrix estimate
        reviews = ReviewModel.gets()
        user_ids = [review.user_id for review in reviews]
        # reviews = ProductAddToCartModel.gets()
        # user_ids = [review.user_id for review in reviews]
        skus = product_storage.get_objects_attribute(
            model_class=ProductVariantModel, attribute="sku", stock_quantity__gt=0
        )

        self.user_mapping = {str(user_ids[i]): i for i in range(len(user_ids))}
        self.product_variant_mapping = {skus[i]: i for i in range(len(skus))}
        self._update_inverse_mapping()
        X_size = len(user_ids), len(skus)

        split_idx = math.floor(len(reviews) * 0.8)
        train_reviews = reviews[:split_idx]
        test_reviews = reviews[split_idx:]
        if split_idx == 0 or split_idx == len(reviews) - 1:
            train_reviews = reviews
            test_reviews = reviews

        test_user_indices = [
            self.user_mapping[str(review.user_id)] for review in test_reviews
        ]
        test_variant_indices = [
            self.product_variant_mapping[review.product_variant_sku]
            for review in test_reviews
            if review.product_variant_sku in self.product_variant_mapping
        ]

        best_error = math.inf
        best_parameters = None

        if len(test_user_indices) == 0 or len(test_variant_indices) == 0:
            logging.warning(
                "Unable to select best parameters for EASE model - no users or "
                "variants found to evaluate its performance"
            )
        else:
            for parameters in self.possible_parameters:
                self._set_parameters(parameters=parameters)
                peak_memory, peak_memory_percentage = self._fit(
                    X_size=X_size,
                    reviews=train_reviews,
                    peak_memory=peak_memory,
                    peak_memory_percentage=peak_memory_percentage,
                )
                peak_memory, peak_memory_percentage, error = self._evaluate(
                    user_indices=test_user_indices,
                    variant_indices=test_variant_indices,
                    peak_memory=peak_memory,
                    peak_memory_percentage=peak_memory_percentage,
                )
                if error < best_error:
                    best_error, best_parameters = error, parameters

        self._set_parameters(parameters=best_parameters)
        self._fit(
            X_size=X_size,
            reviews=reviews,
            peak_memory=peak_memory,
            peak_memory_percentage=peak_memory_percentage,
        )

        end = time.time()

        statistics = TrainingStatisticsModel(
            model_name=self.model_name,
            model_identifier=self.model_identifier,
            duration=end - start,
            peak_memory=peak_memory,
            peak_memory_percentage=peak_memory_percentage,
            metrics={"error": best_error},
            hyperparameters=self.parameters,
        )
        statistics.create()

    @inject
    def retrieve(
        self, user_id: int, model_manager: "ModelManager" = Provide["model_manager"]
    ) -> List[str]:
        user_index = self.user_mapping[str(user_id)]
        X = self.X[user_index]
        B = self.B
        scores = X @ B
        selected_indices = np.argpartition(scores, -model_manager.config.retrieval_size)
        return [self.inverse_variant_mapping[index] for index in selected_indices]

    def predict(
        self,
        user_id: int,
        variants: List[str],
    ) -> List[str]:
        user_index = self.user_mapping[str(user_id)]
        variant_indices = [
            self.product_variant_mapping[sku]
            for sku in variants
            if sku in self.product_variant_mapping
        ]
        X = self.X[user_index, variant_indices]
        B = self.B[
            np.ix_(variant_indices, variant_indices)
        ]  # Submatrix induced by rows and cols `variant_indices`

        scores = X @ B
        sorted_indices = np.argsort(-scores)  # descending
        return [self.inverse_variant_mapping[index] for index in sorted_indices]

    @inject
    def save(
        self,
        identifier: str,
        ease_storage: AbstractEASEStorage = Provide["ease_storage"],
    ) -> None:
        ease_storage.store_matrices(
            matrices=self._get_matrices(), identifier=identifier
        )
        ease_storage.store_parameters(parameters=self.parameters, identifier=identifier)
        ease_storage.store_mappings(
            mappings=self._get_mappings(), identifier=identifier
        )

    @classmethod
    @inject
    def delete(
        cls,
        identifier: str,
        ease_storage: AbstractEASEStorage = Provide["ease_storage"],
    ) -> None:
        ease_storage.delete_matrices(identifier=identifier)
        ease_storage.delete_parameters(identifier=identifier)
        ease_storage.delete_mappings(identifier=identifier)
