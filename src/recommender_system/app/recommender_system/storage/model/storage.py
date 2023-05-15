from recommender_system.models.stored.model.config import ConfigModel
from recommender_system.storage.model.abstract import AbstractModelStorage
from recommender_system.storage.sql.models.model import SQLConfig
from recommender_system.storage.sql.storage import SQLStorage


class SQLModelStorage(SQLStorage, AbstractModelStorage):
    def get_current_config(self) -> ConfigModel:
        query = self.session.query(SQLConfig).select_from(SQLConfig)
        query = query.order_by(SQLConfig.create_at.desc()).limit(1)

        result = query.first()
        if result is None:
            return ConfigModel()

        return ConfigModel(**result.__dict__)
