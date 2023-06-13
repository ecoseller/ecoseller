import logging
from typing import Dict, List, Optional

from dependency_injector.wiring import inject, Provide
import numpy as np

from recommender_system.models.stored.product.product_variant import ProductVariantModel
from recommender_system.storage.feedback.abstract import AbstractFeedbackStorage
from recommender_system.storage.product.abstract import AbstractProductStorage
from recommender_system.storage.gru4rec.abstract import AbstractGRU4RecStorage
from recommender_system.utils.math import sigmoid, sigmoid_derivative


class GPMF:
    explicit_latent_factors: int
    implicit_latent_factors: int

    learning_rate: float

    max_epochs: int

    mapping: Dict[str, int]

    num_epochs: int = 3

    @inject
    def __init__(
        self,
        num_product_variants: int,
        product_storage: AbstractProductStorage = Provide["product_storage"],
    ):

        skus = product_storage.get_objects_attribute(
            model_class=ProductVariantModel, attribute="sku"
        )
        self.mapping = {sku: i for i, sku in enumerate(skus)}

    def train(self) -> None:
        logging.info("Training started")

        R, V = self.get_rating_matrices()

        W = np.random.rand(
            R.shape[0], self.explicit_latent_factors
        )  # There might be different number of product variants to be considered
        Z = np.random.rand(R.shape[1], self.explicit_latent_factors)

        E = np.random.rand(
            V.shape[0], self.implicit_latent_factors, self.implicit_ratings
        )  # There might be different number of product variants to be considered
        F = np.random.rand(
            V.shape[1], self.implicit_latent_factors, self.implicit_ratings
        )

        batches = self.prepare_batches(R=R, V=V)

        epoch = 0
        while epoch < self.max_epochs:
            for batch in batches:
                users = batch[:, 0]
                items = batch[:, 1]

                explicit_target = R[users, items]
                implicit_target = V[users, items]

                explicit_mask = (explicit_target != 0).astype(np.double)
                implicit_mask = (implicit_target != 0).astype(np.double)

                explicit_pred = W[users].T @ Z[:, items]
                implicit_pred = np.tensordot(E[users], F[:, items], axes=([1], [1]))

                gradient_W = (
                    explicit_mask
                    * sigmoid_derivative(explicit_pred)
                    * (sigmoid(explicit_pred) - explicit_target)
                    * Z[items]
                    + np.sum(self.lambda_w_e * (W[users] - E[users]), axis=-1)
                    + self.lambda_w * count_w[users] * W[users]
                )
                W[users] -= self.learning_rate * gradient_W

                gradient_Z = (
                    explicit_mask
                    * sigmoid_derivative(explicit_pred)
                    * (sigmoid(explicit_pred) - explicit_target)
                    * W[users]
                    + self.lambda_z * count_z[items] * Z[items]
                )
                Z[items] -= self.learning_rate * gradient_Z

                gradient_E = (
                    self.lambda_v
                    * implicit_mask
                    * sigmoid_derivative(implicit_pred)
                    * (sigmoid(implicit_pred) - implicit_target)
                    * F[items]
                    + self.lambda_w_e * (W[users] - E[users])
                    + self.lambda_e * count_e[users] * E[users]
                )
                E[users] -= self.learning_rate * gradient_E

                gradient_F = (
                    self.lambda_v
                    * implicit_mask
                    * sigmoid_derivative(implicit_pred)
                    * (sigmoid(implicit_pred) - implicit_target)
                    * E[users]
                    + self.lambda_f * count_f[items] * F[items]
                )
                F[items] -= self.learning_rate * gradient_F

            epoch += 1

        # TODO: Train NN to predict latent factors
        # TODO: Find product variants not in matrices

        # TODO: Concatenate

        # TODO: Save matrices

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
        gru4rec_storage: AbstractGRU4RecStorage = Provide["gru4rec_storage"],
    ) -> None:
        raise NotImplementedError()

    @classmethod
    @inject
    def delete(
        cls,
        identifier: str,
        gru4rec_storage: AbstractGRU4RecStorage = Provide["gru4rec_storage"],
    ) -> None:
        raise NotImplementedError()
