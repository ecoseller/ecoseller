from datetime import datetime
from typing import Any, Dict, List, Optional

from sqlalchemy import and_, case, func
from sqlalchemy.orm.query import Query

from recommender_system.storage.feedback.abstract import AbstractFeedbackStorage
from recommender_system.storage.sql.models.feedback import (
    SQLSession,
    SQLPredictionResult,
    SQLProductDetailEnter,
)
from recommender_system.storage.sql.storage import SQLStorage


class SQLFeedbackStorage(SQLStorage, AbstractFeedbackStorage):
    def get_session_sequences(
        self, session_ids: Optional[List[str]] = None
    ) -> List[List[str]]:
        query = self.get_session_sequences_query(session_ids=session_ids)

        result = []
        for row in query.all():
            result.append(row[0])
        return result

    def get_session_sequences_query(
        self,
        session_ids: Optional[List[str]] = None,
        date_from: Optional[datetime] = None,
    ) -> Query:
        query = self.session.query(SQLSession.visited_product_variants).select_from(
            SQLSession
        )
        if session_ids is not None:
            query = query.filter(SQLSession.id.in_(session_ids))
        if date_from is not None:
            query = query.filter(SQLSession.create_at >= date_from)

        query = query.order_by(SQLSession.id)

        return query

    def count_future_hit(
        self, date_from: datetime, date_to: datetime, k: int, model_name: Optional[str]
    ) -> Dict[str, Any]:
        unnested = (
            self.session.query(
                SQLPredictionResult.id,
                SQLPredictionResult.session_id,
                SQLPredictionResult.scoring_model_name,
                SQLPredictionResult.recommendation_type,
                SQLPredictionResult.create_at,
                func.unnest(SQLPredictionResult.predicted_items).label("item"),
            )
            .select_from(SQLPredictionResult)
            .filter(
                SQLPredictionResult.create_at >= date_from,
                SQLPredictionResult.create_at <= date_to,
            )
            .subquery()
        )

        hits = (
            self.session.query(func.distinct(unnested.c.id).label("id"))
            .select_from(unnested)
            .join(
                SQLProductDetailEnter,
                and_(
                    SQLProductDetailEnter.session_id == unnested.c.session_id,
                    SQLProductDetailEnter.model_name == unnested.c.scoring_model_name,
                    SQLProductDetailEnter.recommendation_type
                    == unnested.c.recommendation_type,
                    SQLProductDetailEnter.product_variant_sku == unnested.c.item,
                    SQLProductDetailEnter.create_at >= unnested.c.create_at,
                    SQLProductDetailEnter.create_at <= date_to,
                ),
            )
            .subquery()
        )

        is_hit = case((hits.c.id.is_not(None), True), else_=False).label("is_hit")

        query = self.session.query(
            is_hit, func.count(SQLPredictionResult.id)
        ).select_from(SQLPredictionResult)
        query = query.outerjoin(hits, SQLPredictionResult.id == hits.c.id)
        if model_name is not None:
            query = query.filter(SQLPredictionResult.scoring_model_name == model_name)
        query = query.group_by(is_hit)

        result = {
            "hit": 0,
            "all": 0,
        }
        for row in query.all():
            is_model_hit, count = row
            if is_model_hit:
                result["hit"] += count
            result["all"] += count

        return result

    def count_direct_hit(
        self, date_from: datetime, date_to: datetime, k: int, model_name: Optional[str]
    ) -> Dict[str, Any]:
        recommendations = self.session.query(SQLPredictionResult.id).select_from(
            SQLPredictionResult
        )
        recommendations = recommendations.filter(
            SQLPredictionResult.create_at >= date_from,
            SQLPredictionResult.create_at <= date_to,
        )
        if model_name is not None:
            recommendations = recommendations.filter(
                SQLPredictionResult.scoring_model_name == model_name
            )

        enters = self.session.query(
            SQLProductDetailEnter.id,
        ).select_from(SQLProductDetailEnter)
        enters = enters.filter(
            SQLProductDetailEnter.model_name.is_not(None),
            SQLProductDetailEnter.recommendation_type.is_not(None),
            SQLProductDetailEnter.position.is_not(None),
            SQLProductDetailEnter.position <= k,
            SQLProductDetailEnter.create_at >= date_from,
            SQLProductDetailEnter.create_at <= date_to,
        )

        return {"hit": enters.count(), "all": recommendations.count()}

    def count_coverage(
        self, date_from: datetime, date_to: datetime, model_name: Optional[str]
    ) -> int:
        items_query = self.session.query(
            func.unnest(SQLPredictionResult.predicted_items).label("item")
        ).select_from(SQLPredictionResult)
        items_query = items_query.filter(
            SQLPredictionResult.create_at >= date_from,
            SQLPredictionResult.create_at <= date_to,
        )
        if model_name is not None:
            items_query = items_query.filter(
                SQLPredictionResult.scoring_model_name == model_name
            )

        items = items_query.subquery()

        query = self.session.query(
            func.distinct(items.c.item),
        ).select_from(items)

        return query.count()

    def count_predictions(
        self, date_from: datetime, date_to: datetime, model_name: Optional[str]
    ) -> int:
        query = self.session.query(SQLPredictionResult.id).select_from(
            SQLPredictionResult
        )
        query = query.filter(
            SQLPredictionResult.create_at >= date_from,
            SQLPredictionResult.create_at <= date_to,
        )
        if model_name is not None:
            query = query.filter(SQLPredictionResult.scoring_model_name == model_name)

        return query.count()

    def get_retrieval_duration(
        self, date_from: datetime, date_to: datetime, model_name: Optional[str]
    ) -> Dict[str, Any]:
        query = self.session.query(
            func.avg(SQLPredictionResult.retrieval_duration),
            func.max(SQLPredictionResult.retrieval_duration),
        ).select_from(SQLPredictionResult)
        query = query.filter(
            SQLPredictionResult.create_at >= date_from,
            SQLPredictionResult.create_at <= date_to,
        )
        if model_name is not None:
            query = query.filter(SQLPredictionResult.retrieval_model_name == model_name)

        row = query.one()
        return {"avg": row[0], "max": row[1]}

    def get_scoring_duration(
        self, date_from: datetime, date_to: datetime, model_name: Optional[str]
    ) -> Dict[str, Any]:
        query = self.session.query(
            func.avg(SQLPredictionResult.scoring_duration),
            func.max(SQLPredictionResult.scoring_duration),
        ).select_from(SQLPredictionResult)
        query = query.filter(
            SQLPredictionResult.create_at >= date_from,
            SQLPredictionResult.create_at <= date_to,
        )
        if model_name is not None:
            query = query.filter(SQLPredictionResult.scoring_model_name == model_name)

        row = query.one()
        return {"avg": row[0], "max": row[1]}
