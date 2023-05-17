from typing import Any, List, Optional

from sqlalchemy import or_

from recommender_system.models.stored.similarity.distance import DistanceModel
from recommender_system.storage.similarity.abstract import AbstractSimilarityStorage
from recommender_system.storage.sql.models.similarity import SQLDistance
from recommender_system.storage.sql.storage import SQLStorage


class SQLSimilarityStorage(SQLStorage, AbstractSimilarityStorage):
    def get_closest_product_variant_skus(
        self, to: str, limit: Optional[int] = None, **kwargs: Any
    ) -> List[str]:
        # TODO: Filter in stock
        query = self.session.query(SQLDistance.lhs, SQLDistance.rhs).select_from(
            SQLDistance
        )
        query = query.filter(or_(SQLDistance.lhs == to, SQLDistance.rhs == to))
        query = self._filter(model_class=DistanceModel, query=query, filters=kwargs)
        query = query.order_by(SQLDistance.distance)
        if limit is not None:
            query = query.limit(limit)

        return [row[0] if row[0] != to else row[1] for row in query.all()]
