from typing import List, Optional

from sqlalchemy.orm.query import Query

from recommender_system.storage.feedback.abstract import AbstractFeedbackStorage
from recommender_system.storage.sql.models.feedback import SQLSession
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
