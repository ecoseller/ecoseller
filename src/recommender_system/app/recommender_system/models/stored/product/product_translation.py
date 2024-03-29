from typing import Optional

from recommender_system.models.stored.product.base import ProductStoredBaseModel
from recommender_system.models.stored.product.product import ProductModel


class ProductTranslationModel(ProductStoredBaseModel):
    """
    This model represents product translation as an object that is stored in
    the database.
    """

    id: int
    language_code: str
    title: str
    meta_title: str
    meta_description: str
    short_description: Optional[str]
    description: Optional[str]
    slug: str

    product_id: int

    class Meta:
        primary_key = "id"

    @property
    def product(self) -> ProductModel:
        return self._storage.get_object(model_class=ProductModel, pk=self.product_id)
