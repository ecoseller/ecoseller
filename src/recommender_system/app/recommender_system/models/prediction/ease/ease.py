import logging
from typing import Dict, List, TYPE_CHECKING

import numpy as np
from dependency_injector.wiring import inject, Provide

from recommender_system.models.stored.feedback.review import ReviewModel
from recommender_system.models.stored.product.product_variant import ProductVariantModel
from recommender_system.storage.ease.abstract import AbstractEASEStorage
from recommender_system.storage.product.abstract import AbstractProductStorage

if TYPE_CHECKING:
    from recommender_system.managers.model_manager import ModelManager


class EASE:
    l2: float

    X: np.ndarray
    B: np.ndarray

    user_mapping: Dict[str, int]
    product_variant_mapping: Dict[str, int]
    inverse_variant_mapping: Dict[int, str]

    def __init__(self):
        self.l2 = 10

    @classmethod
    @inject
    def load(
        cls,
        identifier: str,
        ease_storage: AbstractEASEStorage = Provide["ease_storage"],
    ) -> "EASE":
        ease = cls()

        matrices = ease_storage.get_matrices(identifier=identifier)
        ease.X = matrices["X"]
        ease.B = matrices["B"]

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

    @inject
    def train(
        self, product_storage: AbstractProductStorage = Provide["product_storage"]
    ) -> None:
        logging.info("Training started")

        logging.info("Preparing rating matrix")

        reviews = ReviewModel.gets()
        user_ids = [review.user_id for review in reviews]
        skus = product_storage.get_objects_attribute(
            model_class=ProductVariantModel, attribute="sku", stock_quantity__gt=0
        )

        self.user_mapping = {str(user_ids[i]): i for i in range(len(user_ids))}
        self.product_variant_mapping = {skus[i]: i for i in range(len(skus))}
        self._update_inverse_mapping()

        self.X = np.zeros((len(user_ids), len(skus)), dtype=np.double)
        for review in reviews:
            if review.product_variant_sku not in self.product_variant_mapping:
                continue
            user = self.user_mapping[str(review.user_id)]
            product_variant = self.product_variant_mapping[review.product_variant_sku]
            self.X[user, product_variant] = review.rating

        logging.info("Computing matrix B")

        G = self.X.T @ self.X
        diag = np.diag_indices(G.shape[0])
        G[diag] += self.l2
        P = np.linalg.inv(G)
        self.B = P / (-np.diag(P))
        self.B[diag] = 0

        logging.info("Training finished")

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
        ease_storage.delete_mappings(identifier=identifier)
