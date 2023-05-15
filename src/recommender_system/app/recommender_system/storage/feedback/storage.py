from recommender_system.storage.feedback.abstract import AbstractFeedbackStorage
from recommender_system.storage.sql.storage import SQLStorage


class SQLFeedbackStorage(SQLStorage, AbstractFeedbackStorage):
    pass
