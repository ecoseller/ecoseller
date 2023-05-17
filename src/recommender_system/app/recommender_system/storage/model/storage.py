from recommender_system.storage.model.abstract import AbstractModelStorage
from recommender_system.storage.sql.storage import SQLStorage


class SQLModelStorage(SQLStorage, AbstractModelStorage):
    pass
