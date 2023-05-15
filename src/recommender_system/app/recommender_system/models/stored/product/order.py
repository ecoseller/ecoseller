from datetime import datetime
from typing import List

from dependency_injector.wiring import inject, Provide

from recommender_system.models.stored.product.base import (
    ProductStoredBaseModel,
)
from recommender_system.models.stored.product.product_variant import (
    ProductVariantModel,
)
from recommender_system.models.stored.feedback.session import SessionModel
from recommender_system.storage.feedback.abstract import AbstractFeedbackStorage


class OrderModel(ProductStoredBaseModel):
    """
    This model represents order as an object that is stored in the database.
    """

    id: int
    update_at: datetime
    create_at: datetime

    session_id: str

    class Meta:
        primary_key = "id"

    @property
    @inject
    def session(
        self, feedback_storage: AbstractFeedbackStorage = Provide["feedback_storage"]
    ) -> SessionModel:
        return feedback_storage.get_object(model_class=SessionModel, pk=self.session_id)

    @property
    def product_variants(self) -> List[ProductVariantModel]:
        from recommender_system.models.stored.product.order_product_variant import (
            OrderProductVariantModel,
        )

        return self._storage.get_related_objects(
            model=self, relation_model_class=OrderProductVariantModel
        )

    def delete(self) -> None:
        from recommender_system.models.stored.product.order_product_variant import (
            OrderProductVariantModel,
        )

        for opv in OrderProductVariantModel.gets(order_id=self.id):
            opv.delete()
        super().delete()

    def add_product_variant(
        self, product_variant: ProductVariantModel, amount: int
    ) -> None:
        from recommender_system.models.stored.product.order_product_variant import (
            OrderProductVariantModel,
        )

        OrderProductVariantModel(
            order_id=self.id, product_variant_sku=product_variant.sku, amount=amount
        ).create()
