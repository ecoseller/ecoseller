from datetime import datetime
import random
from typing import List, Optional

from dependency_injector.wiring import inject, Provide
import numpy as np

from recommender_system.models.stored.model.latest_identifier import (
    LatestIdentifierModel,
)
from recommender_system.models.prediction.abstract import AbstractPredictionModel
from recommender_system.models.prediction.similarity.tools import (
    prepare_variants,
    compute_numerical_distances,
    compute_categorical_distances,
)
from recommender_system.models.stored.similarity.distance import DistanceModel
from recommender_system.storage.abstract import AbstractStorage


class SimilarityPredictionModel(AbstractPredictionModel):
    class Meta:
        model_name = "similarity"

    @property
    def default_identifier(self) -> str:
        return f"similarity_{datetime.now().isoformat()}"

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
                        model_identifier=self.identifier,
                    )
                )
        similarity_storage.bulk_create_objects(models=distance_models)

    def train(self) -> None:
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
        similarity_storage: AbstractStorage = Provide["similarity_storage"],
    ) -> List[str]:
        return similarity_storage.get_closest_product_variant_pks(
            to=variant, limit=1000
        )

    @inject
    def retrieve_cart(
        self,
        session_id: str,
        user_id: Optional[int],
        variants_in_cart: List[str],
        similarity_storage: AbstractStorage = Provide["similarity_storage"],
    ) -> List[str]:
        # TODO: Check if there are variants in cart in model manager
        return similarity_storage.get_closest_product_variant_pks(
            to=random.choice(variants_in_cart), limit=1000
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
        similarity_storage: AbstractStorage = Provide["similarity_storage"],
    ) -> List[str]:
        return similarity_storage.get_closest_product_variant_pks(
            to=variant, pks=variants
        )

    @inject
    def score_cart(
        self,
        session_id: str,
        user_id: Optional[int],
        variants: List[str],
        variants_in_cart: List[str],
        similarity_storage: AbstractStorage = Provide["similarity_storage"],
    ) -> List[str]:
        # TODO: Check if there are variants in cart in model manager
        return similarity_storage.get_closest_product_variant_pks(
            to=random.choice(variants_in_cart), pks=variants
        )

    @inject
    def delete(
        self, similarity_storage: AbstractStorage = Provide["similarity_storage"]
    ) -> None:
        similarity_storage.delete(
            model_class=DistanceModel, model_identifier=self.identifier
        )

    def replace_old(self) -> None:
        try:
            latest_identifier = self.get_latest_identifier()
        except LatestIdentifierModel.DoesNotExist:
            latest_identifier = None
        LatestIdentifierModel(
            model_name=self.Meta.model_name, identifier=self.identifier
        ).save()
        if latest_identifier is not None:
            self.__class__(identifier=latest_identifier).delete()
