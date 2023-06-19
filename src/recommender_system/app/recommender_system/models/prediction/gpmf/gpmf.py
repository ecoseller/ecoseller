import logging
from typing import Any, Dict, List, Optional, Tuple

from dependency_injector.wiring import inject, Provide
import numpy as np

from recommender_system.storage.feedback.abstract import AbstractFeedbackStorage
from recommender_system.storage.gpmf.abstract import AbstractGPMFStorage
from recommender_system.utils.math import sigmoid, sigmoid_derivative


class GPMF:
    explicit_latent_factors: int
    implicit_latent_factors: int
    implicit_ratings: int

    max_epochs: int = 3
    learning_rate: float
    batch_size: int

    W: np.ndarray
    Z: np.ndarray
    E: np.ndarray
    F: np.ndarray

    item_mapping: Dict[str, int]
    user_mapping: Dict[int, int]

    def __init__(self):
        self.explicit_latent_factors = 10
        self.implicit_latent_factors = 10
        self.implicit_ratings = 1
        self.learning_rate = 0.001
        self.batch_size = 256

    @classmethod
    def load(cls, identifier: str) -> "GPMF":
        return cls()

    @property
    def product_variants(self) -> int:
        return len(self.item_mapping.keys())

    @property
    def users(self) -> int:
        return len(self.user_mapping.keys())

    @inject
    def _get_rating_matrices(
        self, feedback_storage: AbstractFeedbackStorage = Provide["feedback_storage"]
    ) -> Tuple[dict, dict, Dict[str, Any], Dict[int, Any]]:
        explicit_ratings = feedback_storage.get_explicit_ratings()
        implicit_ratings = feedback_storage.get_explicit_ratings()
        # implicit_ratings = {
        #     key: np.array(value) for key, value in explicit_ratings.items()
        # }

        variants = set()
        users = set()
        for key in explicit_ratings.keys():
            variants.add(key[1])
            users.add(key[0])

        for key in implicit_ratings.keys():
            variants.add(key[1])
            users.add(key[0])

        variants = list(variants)
        users = list(users)

        item_mapping = {}
        user_mapping = {}
        for i in range(max(len(variants), len(users))):
            if i < len(variants):
                item_mapping[variants[i]] = i
            if i < len(users):
                user_mapping[users[i]] = i

        return explicit_ratings, implicit_ratings, item_mapping, user_mapping

    def _prepare_batches(self, R: dict, V: dict) -> List[List[Tuple[int, str]]]:
        data = list(set(R.keys()) | set(V.keys()))
        np.random.shuffle(data)
        batches = []
        i = 0
        while i + self.batch_size < len(data):
            batches.append(data[i : i + self.batch_size])
            i += self.batch_size
        batches.append(data[i:])
        return batches

    def _get_counts(self, R: dict, V: dict) -> Tuple[dict, dict, dict, dict]:
        count_w = {value: 0 for value in self.user_mapping.values()}
        count_z = {value: 0 for value in self.item_mapping.values()}
        count_e = {value: 0 for value in self.user_mapping.values()}
        count_f = {value: 0 for value in self.item_mapping.values()}
        return count_w, count_z, count_e, count_f

    def train(self) -> None:
        logging.info("Training started")

        R, V, self.item_mapping, self.user_mapping = self._get_rating_matrices()

        self.W = np.random.rand(
            self.product_variants, self.explicit_latent_factors
        )  # There might be different number of product variants to be considered
        self.Z = np.random.rand(self.users, self.explicit_latent_factors)

        # self.E = np.random.rand(
        #     self.product_variants, self.implicit_latent_factors, self.implicit_ratings
        # )  # There might be different number of product variants to be considered
        # self.F = np.random.rand(
        #     self.users, self.implicit_latent_factors, self.implicit_ratings
        # )
        self.E = np.random.rand(
            self.product_variants, self.implicit_latent_factors
        )  # There might be different number of product variants to be considered
        self.F = np.random.rand(self.users, self.implicit_latent_factors)

        batches = self._prepare_batches(R=R, V=V)

        count_w, count_z, count_e, count_f = self._get_counts(R=R, V=V)
        lambda_v, lambda_w_e, lambda_w, lambda_z, lambda_e, lambda_f = 1, 1, 1, 1, 1, 1
        # TODO: Counts and lambdas...

        epoch = 0
        while epoch < self.max_epochs:
            for batch in batches:
                mapped_batch = [
                    (self.user_mapping[item[0]], self.item_mapping[item[1]])
                    for item in batch
                ]
                users = [item[0] for item in mapped_batch]
                items = [item[1] for item in mapped_batch]

                explicit_target = np.array([R[item] for item in batch])
                implicit_target = np.array([V[item] for item in batch])

                explicit_pred = self.W[users].T @ self.Z[items]
                # implicit_pred = np.tensordot(
                #     self.E[users], self.F[items], axes=([1, 2], [2, 1])
                # )
                implicit_pred = self.E[users].T @ self.F[items]
                explicit_pred = np.array([explicit_pred[item] for item in mapped_batch])
                implicit_pred = np.array([implicit_pred[item] for item in mapped_batch])

                c_w = np.array([count_w[item] for item in users])[:, np.newaxis]
                c_z = np.array([count_z[item] for item in items])[:, np.newaxis]
                c_e = np.array([count_e[item] for item in users])[:, np.newaxis]
                c_f = np.array([count_f[item] for item in items])[:, np.newaxis]

                gradient_W = (
                    (
                        sigmoid_derivative(explicit_pred)
                        * (sigmoid(explicit_pred) - explicit_target)
                    )[:, np.newaxis]
                    * self.Z[items]
                    + np.sum(lambda_w_e * (self.W[users] - self.E[users]), axis=-1)[
                        :, np.newaxis
                    ]
                    + lambda_w * c_w * self.W[users]
                )
                self.W[users] -= self.learning_rate * gradient_W

                gradient_Z = (
                    sigmoid_derivative(explicit_pred)
                    * (sigmoid(explicit_pred) - explicit_target)
                )[:, np.newaxis] * self.W[users] + lambda_z * c_z * self.Z[items]
                self.Z[items] -= self.learning_rate * gradient_Z

                gradient_E = (
                    (
                        lambda_v
                        * sigmoid_derivative(implicit_pred)
                        * (sigmoid(implicit_pred) - implicit_target)
                    )[:, np.newaxis]
                    * self.F[items]
                    + lambda_w_e * (self.W[users] - self.E[users])
                    + lambda_e * c_e * self.E[users]
                )
                self.E[users] -= self.learning_rate * gradient_E

                gradient_F = (
                    lambda_v
                    * sigmoid_derivative(implicit_pred)
                    * (sigmoid(implicit_pred) - implicit_target)
                )[:, np.newaxis] * self.E[users] + lambda_f * c_f * self.F[items]
                self.F[items] -= self.learning_rate * gradient_F

            epoch += 1

        # TODO: Handle variants without data

        logging.info("Training finished")

    def predict(
        self,
        session_id: str,
        variants: Optional[List[str]] = None,
        feedback_storage: AbstractFeedbackStorage = Provide["feedback_storage"],
    ) -> List[str]:
        raise NotImplementedError()

    @inject
    def save(
        self,
        identifier: str,
        gpmf_storage: AbstractGPMFStorage = Provide["gpmf_storage"],
    ) -> None:
        matrices = {key: getattr(self, key) for key in ["W", "Z", "E", "F"]}
        mappings = {key: getattr(self, key) for key in ["item_mapping", "user_mapping"]}
        gpmf_storage.store_matrices(matrices=matrices, identifier=identifier)
        gpmf_storage.store_mappings(mappings=mappings, identifier=identifier)

    @classmethod
    @inject
    def delete(
        cls,
        identifier: str,
        gpmf_storage: AbstractGPMFStorage = Provide["gpmf_storage"],
    ) -> None:
        gpmf_storage.delete_matrices(identifier=identifier)
        gpmf_storage.delete_mappings(identifier=identifier)
