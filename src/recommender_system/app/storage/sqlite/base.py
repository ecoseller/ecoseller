from typing import Type

from models.stored.base import StoredBaseModel


class SqliteBase:
    __tablename__: str

    class Meta:
        origin_model: Type[StoredBaseModel]
