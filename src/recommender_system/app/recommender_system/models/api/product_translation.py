from typing import Optional

from recommender_system.models.api.base import ApiBaseModel
from recommender_system.models.stored.product_translation import ProductTranslationModel


class ProductTranslation(ApiBaseModel):
    """
    This model represents product translation as an object that is sent from
    core to RS component via API.
    """

    id: int
    language_code: str
    title: str
    meta_title: str
    meta_description: str
    short_description: Optional[str]
    description: Optional[str]
    slug: str

    class Meta:
        stored_model_class = ProductTranslationModel
