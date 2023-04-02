from typing import Type

from recommender_system.models.stored.base import StoredBaseModel


class SQLBase:
    __tablename__: str

    class Meta:
        origin_model: Type[StoredBaseModel]
