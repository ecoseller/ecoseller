from typing import Optional

from recommender_system.models.stored.base import (
    SimilarityStoredBaseModel,
)


class DistanceModel(SimilarityStoredBaseModel):
    """
    This model represents distance of product variants as an object that is stored in the database.
    """

    id: Optional[int]
    lhs: str
    rhs: str
    distance: float

    class Meta:
        primary_key = "id"
