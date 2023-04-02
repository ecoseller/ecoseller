from typing import Any

from recommender_system.models.stored.base import StoredBaseModel
from recommender_system.models.stored.product import ProductModel


class ProductTranslationModel(StoredBaseModel):
    """
    This model represents product translation as an object that is stored in
    the database.
    """

    id: int
    language_code: str
    title: str
    meta_title: str
    meta_description: str
    short_description: str
    description: str
    slug: str

    product_id: int

    class Meta:
        primary_key = "id"

    @property
    def product(self) -> ProductModel:
        return self._storage.get_object(model_class=ProductModel, pk=self.product_id)
