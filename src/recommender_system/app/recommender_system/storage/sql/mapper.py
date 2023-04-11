from typing import ClassVar, Dict, Type

from recommender_system.models.stored.base import StoredBaseModel
from recommender_system.storage.sql.models import (
    SQLAttribute,
    SQLAttributeProductVariant,
    SQLAttributeType,
    SQLAttributeTypeProductType,
    Base,
    SQLProduct,
    SQLProductProductVariant,
    SQLProductTranslation,
    SQLProductType,
    SQLProductVariant,
)


_sql_models = [
    SQLAttribute,
    SQLAttributeProductVariant,
    SQLAttributeType,
    SQLAttributeTypeProductType,
    SQLProduct,
    SQLProductProductVariant,
    SQLProductTranslation,
    SQLProductType,
    SQLProductVariant,
]


class SQLModelMapper:
    mapping: ClassVar[Dict[Type[StoredBaseModel], Type[Base]]] = {
        sql_model.Meta.origin_model: sql_model for sql_model in _sql_models
    }

    @classmethod
    def map(cls, model_class: Type[StoredBaseModel]) -> Type[Base]:
        return cls.mapping[model_class]
