from typing import List

from recommender_system.models.stored.feedback.product_detail_enter import (
    ProductDetailEnterModel,
)
from recommender_system.storage.feedback.abstract import AbstractFeedbackStorage
from recommender_system.storage.sql.mapper import SQLModelMapper
from recommender_system.storage.sql.storage import SQLStorage


class SQLFeedbackStorage(SQLStorage, AbstractFeedbackStorage):
    def get_session_sequences(self) -> List[List[str]]:
        sql_class = SQLModelMapper.map(model_class=ProductDetailEnterModel)
        query = self.session.query(
            sql_class.product_variant_sku,
            sql_class.session_id,
        )
        query = query.select_from(sql_class)
        query = query.order_by(sql_class.session_id, sql_class.create_at)

        result = []
        current_session = None
        current_session_skus = []
        for row in query.all():
            if row[1] == current_session:
                current_session_skus.append(row[0])
            else:
                if len(current_session_skus) > 0:
                    result.append(current_session_skus)
                current_session_skus = []
                current_session = row[1]
        return result
