from datetime import datetime
from typing import Optional, Dict

from sqlalchemy import case, false, func
from sqlalchemy.sql import true

from recommender_system.models.stored.model.config import ConfigModel
from recommender_system.storage.model.abstract import AbstractModelStorage
from recommender_system.storage.sql.models.model import (
    SQLConfig,
    SQLTrainingFinished,
    SQLTrainingStarted,
    SQLTrainingStatistics,
)
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

    def count_trainings(
        self, date_from: datetime, date_to: datetime, model_name: Optional[str]
    ) -> Dict[str, int]:
        finished = case(
            (
                SQLTrainingFinished.training_id.isnot(None),
                true(),
            ),
            else_=false(),
        ).label("finished")

        query = self.session.query(
            func.count(SQLTrainingStarted.training_id),
            finished,
        ).select_from(SQLTrainingStarted)
        query = query.filter(
            SQLTrainingStarted.create_at >= date_from,
            SQLTrainingStarted.create_at <= date_to,
        )
        if model_name is not None:
            query = query.filter(SQLTrainingStarted.model_name == model_name)

        query = query.outerjoin(
            SQLTrainingFinished,
            SQLTrainingStarted.training_id == SQLTrainingFinished.training_id,
        )
        query = query.group_by(finished)

        result = {"started": 0, "completed": 0, "failed": 0}

        for row in query.all():
            result["started"] += row[0]
            if row[1]:
                result["completed"] += row[0]
            else:
                result["failed"] += row[0]

        return result

    def get_peak_memory(
        self, date_from: datetime, date_to: datetime, model_name: Optional[str]
    ) -> Dict[str, Dict[str, int]]:
        query = self.session.query(
            func.avg(SQLTrainingStatistics.peak_memory),
            func.max(SQLTrainingStatistics.peak_memory),
            func.avg(SQLTrainingStatistics.peak_memory_percentage),
            func.max(SQLTrainingStatistics.peak_memory_percentage),
        ).select_from(SQLTrainingStatistics)

        query = query.filter(
            SQLTrainingStatistics.create_at >= date_from,
            SQLTrainingStatistics.create_at <= date_to,
        )
        if model_name is not None:
            query = query.filter(SQLTrainingStatistics.model_name == model_name)

        row = query.one()

        return {
            "memory": {"avg": row[0], "max": row[1]},
            "percentage": {"avg": row[2], "max": row[3]},
        }

    def get_training_duration(
        self, date_from: datetime, date_to: datetime, model_name: Optional[str]
    ) -> Dict[str, int]:
        query = self.session.query(
            func.avg(SQLTrainingStatistics.duration),
            func.max(SQLTrainingStatistics.duration),
        ).select_from(SQLTrainingStatistics)

        query = query.filter(
            SQLTrainingStatistics.create_at >= date_from,
            SQLTrainingStatistics.create_at <= date_to,
        )
        if model_name is not None:
            query = query.filter(SQLTrainingStatistics.model_name == model_name)

        row = query.one()

        return {"avg": row[0], "max": row[1]}
