from datetime import datetime
from typing import Optional

from sqlalchemy.sql import true

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

    def get_last_training_date(
        self, model_name: str, full_train: bool = False
    ) -> Optional[datetime]:
        query = (
            self.session.query(SQLTrainingStatistics.create_at)
            .select_from(SQLTrainingStatistics)
            .order_by(SQLTrainingStatistics.create_at.desc())
        )
        if full_train:
            query = query.filter(SQLTrainingStatistics.full_train.is_(true()))
        result = query.first()
        if result is None:
            return result
        return result[0]

    def count_incremental_trainings(self, model_name: str) -> int:
        last_full_train_date = self.get_last_training_date(
            model_name=model_name, full_train=True
        )
        query = self.session.query(SQLTrainingStatistics).select_from(
            SQLTrainingStatistics
        )
        if last_full_train_date:
            query = query.filter(SQLTrainingStatistics.create_at > last_full_train_date)

        return query.count()
