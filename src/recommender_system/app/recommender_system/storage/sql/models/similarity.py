from sqlalchemy.sql.schema import Column, Index
from sqlalchemy.sql.sqltypes import (
    DECIMAL,
    Integer,
    String,
)
from sqlalchemy.orm import declarative_base, DeclarativeBase

from recommender_system.models.stored.distance import DistanceModel
from recommender_system.storage.sql.base import SQLSimilarityBase


SimilarityBase: DeclarativeBase = declarative_base(cls=SQLSimilarityBase)


class SQLDistance(SimilarityBase):
    """
    This model represents product add to cart table in SQL database.
    """

    id = Column(Integer(), primary_key=True)
    lhs = Column(String(255), nullable=False)
    rhs = Column(String(255), nullable=False)
    distance = Column(DECIMAL(), nullable=False)

    __tablename__ = "distance"

    __table_args__ = (Index("distance_distance_idx", distance),)

    class Meta:
        origin_model = DistanceModel
