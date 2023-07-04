from datetime import datetime
from typing import Optional

from recommender_system.models.stored.model.config import ConfigModel
from recommender_system.storage.model.abstract import AbstractModelStorage
from recommender_system.storage.sql.models.model import SQLConfig, SQLTrainingStatistics
from recommender_system.storage.sql.storage import SQLStorage


class SQLModelStorage(SQLStorage, AbstractModelStorage):
    def get_current_config(self) -> ConfigModel:
        query = self.session.query(SQLConfig).select_from(SQLConfig)
        query = query.order_by(SQLConfig.create_at.desc()).limit(1)

        result = query.first()
        if result is None:
            return ConfigModel()

        return ConfigModel(**result.__dict__)

    def get_last_training_date(self, model_name: str) -> Optional[datetime]:
        query = (
            self.session.query(SQLTrainingStatistics.create_at)
            .select_from(SQLTrainingStatistics)
            .order_by(SQLTrainingStatistics.create_at.desc())
        )
        result = query.first()
        if result is None:
            return result
        return result[0]
