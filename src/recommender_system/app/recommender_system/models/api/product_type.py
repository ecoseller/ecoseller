from datetime import datetime
from typing import List, Optional

from recommender_system.models.api.base import ApiBaseModel
from recommender_system.models.stored.product.product_type import ProductTypeModel


class ProductType(ApiBaseModel):
    """
    This model represents product type as an object that is sent from
    core to RS component via API.
    """

    id: int
    name: Optional[str]
    update_at: datetime
    create_at: datetime
    products: List[int]
    attribute_types: List[int]

    class Meta:
        stored_model_class = ProductTypeModel

    def save(self) -> None:
        super().save()
        type_model = ProductTypeModel.get(pk=self.id)
        type_model.update_attribute_types(attribute_types=self.attribute_types)
