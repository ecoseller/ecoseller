from datetime import datetime
from typing import List, Tuple

from dependency_injector.wiring import inject, Provide

from recommender_system.models.api.base import ApiBaseModel
from recommender_system.models.stored.product.order import OrderModel
from recommender_system.models.stored.product.order_product_variant import (
    OrderProductVariantModel,
)
from recommender_system.storage.product.abstract import AbstractProductStorage


class Order(ApiBaseModel):
    """
    This model represents order as an object that is sent from core to RS
    component via API.
    """

    token: str
    update_at: datetime
    create_at: datetime

    session_id: str
    product_variants: List[Tuple[str, int]]

    class Meta:
        stored_model_class = OrderModel

    @inject
    def save(
        self, product_storage: AbstractProductStorage = Provide["product_storage"]
    ) -> None:
        super().save()

        opvs = []
        for sku, quantity in self.product_variants:
            opvs.append(
                OrderProductVariantModel(
                    quantity=quantity, order_token=self.token, product_variant_sku=sku
                )
            )
        product_storage.bulk_create_objects(models=opvs)
