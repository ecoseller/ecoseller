from typing import Optional

from recommender_system.models.api.base import ApiBaseModel
from recommender_system.models.stored.product.category_ancestor import (
    CategoryAncestorModel,
)


class Category(ApiBaseModel):
    """
    This model represents category as an object that is sent from
    core to RS component via API.
    """

    id: int
    parent_id: Optional[int]

    def save(self) -> None:
        """
        Updates CategoryAncestorModel objects in the database.

        Returns
        -------
        None

        """
        for ancestor in CategoryAncestorModel.gets(category_id=self.id):
            ancestor.delete()
        if self.parent_id is not None:
            parent_ancestors = CategoryAncestorModel.gets(category_id=self.parent_id)
            for ancestor in parent_ancestors:
                CategoryAncestorModel(
                    category_id=self.id,
                    category_ancestor_id=ancestor.category_ancestor_id,
                ).create()
            CategoryAncestorModel(
                category_id=self.id,
                category_ancestor_id=self.parent_id,
            ).create()
        CategoryAncestorModel(
            category_id=self.id,
            category_ancestor_id=self.id,
        ).create()
