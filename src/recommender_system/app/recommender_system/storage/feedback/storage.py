from typing import Dict, List, Optional, Tuple

from recommender_system.models.stored.feedback.product_detail_enter import (
    ProductDetailEnterModel,
)
from recommender_system.storage.feedback.abstract import AbstractFeedbackStorage
from recommender_system.storage.sql.mapper import SQLModelMapper
from recommender_system.storage.sql.models.feedback import SQLReview
from recommender_system.storage.sql.storage import SQLStorage


class SQLFeedbackStorage(SQLStorage, AbstractFeedbackStorage):
    def get_session_sequences(
        self, session_ids: Optional[List[str]] = None
    ) -> List[List[str]]:
        sql_class = SQLModelMapper.map(model_class=ProductDetailEnterModel)
        query = self.session.query(
            sql_class.product_variant_sku,
            sql_class.session_id,
        )
        query = query.select_from(sql_class)
        if session_ids is not None:
            query = query.filter(sql_class.session_id.in_(session_ids))
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
        if len(current_session_skus) > 0:
            result.append(current_session_skus)
        return result

    def get_product_variant_skus_with_rating(self) -> List[str]:
        # TODO: Select implicit rating as well

        query = (
            self.session.query(SQLReview.product_variant_sku)
            .select_from(SQLReview)
            .distinct()
        )

        result = []
        for row in query.all():
            result.append(row[0])
        return result

    def get_user_ids_with_rating(self) -> List[int]:
        # TODO: Select implicit rating as well

        query = self.session.query(SQLReview.user_id).select_from(SQLReview).distinct()

        result = []
        for row in query.all():
            result.append(row[0])
        return result

    def get_explicit_ratings(self) -> Dict[Tuple[int, str], int]:
        query = self.session.query(
            SQLReview.user_id, SQLReview.product_variant_sku, SQLReview.rating
        ).select_from(SQLReview)

        return {(row[0], row[1]): row[2] for row in query.all()}
