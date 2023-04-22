from typing import Optional, List

from dependency_injector.wiring import inject, Provide

from recommender_system.models.prediction.abstract import AbstractPredictionModel
from recommender_system.models.stored.product_variant import ProductVariantModel
from recommender_system.storage.abstract import AbstractStorage


class DummyPredictionModel(AbstractPredictionModel):
    @inject
    def predict(
        self,
        session_id: str,
        user_id: Optional[int],
        variants: Optional[List[str]] = None,
        storage: AbstractStorage = Provide["product_storage"],
    ) -> List[str]:
        if variants is not None:
            return variants
        return storage.get_objects_attribute(
            model_class=ProductVariantModel, attribute="sku"
        )
