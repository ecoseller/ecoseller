from typing import List, Optional

from recommender_system.storage.feedback.abstract import AbstractFeedbackStorage
from recommender_system.storage.sql.models.feedback import SQLSession
from recommender_system.storage.sql.storage import SQLStorage


class SQLFeedbackStorage(SQLStorage, AbstractFeedbackStorage):
    def get_session_sequences(
        self, session_ids: Optional[List[str]] = None
    ) -> List[List[str]]:
        query = self.session.query(SQLSession.visited_product_variants).select_from(
            SQLSession
        )
        if session_ids is not None:
            query = query.filter(SQLSession.id.in_(session_ids))

        result = []
        for row in query.all():
            result.append(row[0])
        return result
