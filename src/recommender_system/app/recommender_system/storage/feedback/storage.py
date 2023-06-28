from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple

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
        self, session_ids: Optional[List[str]] = None
    ) -> Query:
        query = self.session.query(SQLSession.visited_product_variants).select_from(
            SQLSession
        )
        if session_ids is not None:
            query = query.filter(SQLSession.id.in_(session_ids))

        query = query.order_by(SQLSession.id)

        return query

    def count_future_hit(
        self, date_from: datetime, date_to: datetime
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
            SQLPredictionResult.scoring_model_name,
            SQLPredictionResult.recommendation_type,
            is_hit,
            func.count(SQLPredictionResult.id),
        ).select_from(SQLPredictionResult)
        query = query.outerjoin(hits, SQLPredictionResult.id == hits.c.id)
        query = query.group_by(
            SQLPredictionResult.scoring_model_name,
            SQLPredictionResult.recommendation_type,
            is_hit,
        )

        result = {}
        for row in query.all():
            model_name, recommendation_type, is_model_hit, count = row
            if model_name not in result:
                result[model_name] = {}
            if recommendation_type not in result[model_name]:
                result[model_name][recommendation_type] = {
                    "hit": 0,
                    "all": 0,
                }
            if is_model_hit:
                result[model_name][recommendation_type]["hit"] += count
            result[model_name][recommendation_type]["all"] += count

        return result

    def count_direct_hit(
        self, date_from: datetime, date_to: datetime, k: int
    ) -> Dict[str, Any]:
        recommendations = self.session.query(
            SQLPredictionResult.scoring_model_name.label("model_name"),
            SQLPredictionResult.recommendation_type,
            func.count(SQLPredictionResult.id),
        ).select_from(SQLPredictionResult)
        recommendations = recommendations.filter(
            SQLPredictionResult.create_at >= date_from,
            SQLPredictionResult.create_at <= date_to,
        )
        recommendations = recommendations.group_by(
            SQLPredictionResult.scoring_model_name,
            SQLPredictionResult.recommendation_type,
        )

        enters = self.session.query(
            SQLProductDetailEnter.model_name,
            SQLProductDetailEnter.recommendation_type,
            func.count(SQLProductDetailEnter.id),
        ).select_from(SQLProductDetailEnter)
        enters = enters.filter(
            SQLProductDetailEnter.model_name.is_not(None),
            SQLProductDetailEnter.recommendation_type.is_not(None),
            SQLProductDetailEnter.position.is_not(None),
            SQLProductDetailEnter.position <= k,
            SQLProductDetailEnter.create_at >= date_from,
            SQLProductDetailEnter.create_at <= date_to,
        )
        enters = enters.group_by(
            SQLProductDetailEnter.model_name,
            SQLProductDetailEnter.recommendation_type,
        )

        result = {}
        for row in recommendations.all():
            model_name, recommendation_type, count = row
            if model_name not in result:
                result[model_name] = {}
            if recommendation_type not in result[model_name]:
                result[model_name][recommendation_type] = {
                    "hit": 0,
                    "all": 0,
                }
            result[model_name][recommendation_type]["all"] += count

        for row in enters.all():
            model_name, recommendation_type, count = row
            if model_name not in result:
                result[model_name] = {}
            if recommendation_type not in result[model_name]:
                result[model_name][recommendation_type] = {
                    "hit": 0,
                    "all": 0,
                }
            result[model_name][recommendation_type]["hit"] += count

        return result

    def count_coverage(
        self, date_from: datetime, date_to: datetime, per_model: bool, per_type: bool
    ) -> List[Tuple[Any, ...]]:
        columns = []
        if per_model:
            columns += [SQLPredictionResult.scoring_model_name]
        if per_type:
            columns += [SQLPredictionResult.recommendation_type]

        items = (
            self.session.query(
                *columns, func.unnest(SQLPredictionResult.predicted_items).label("item")
            )
            .select_from(SQLPredictionResult)
            .filter(
                SQLPredictionResult.create_at >= date_from,
                SQLPredictionResult.create_at <= date_to,
            )
            .subquery()
        )

        items_columns = []
        if per_model:
            items_columns += [items.c.scoring_model_name]
        if per_type:
            items_columns += [items.c.recommendation_type]

        query = self.session.query(
            *items_columns,
            func.count(func.distinct(items.c.item)),
        ).select_from(items)
        if len(items_columns) > 0:
            query = query.group_by(*items_columns)

        return query.all()
