from typing import Optional

from recommender_system.models.stored.base import (
    ProductStoredBaseModel,
)


class CategoryAncestorModel(ProductStoredBaseModel):
    """
    This model represents category and its ancestor relation as an object that
    is stored in the database.
    """

    id: Optional[int]

    category_id: int
    category_ancestor_id: int

    class Meta:
        primary_key = "id"
