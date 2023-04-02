from typing import ClassVar, Dict, Type

from models.stored.base import StoredBaseModel
from storage.sqlite.models import (
    SqliteAttribute,
    SqliteAttributeProductVariant,
    SqliteAttributeType,
    SqliteAttributeTypeProductType,
    Base,
    SqliteProduct,
    SqliteProductProductVariant,
    SqliteProductTranslation,
    SqliteProductType,
    SqliteProductVariant,
)


_sqlite_models = [
    SqliteAttribute,
    SqliteAttributeProductVariant,
    SqliteAttributeType,
    SqliteAttributeTypeProductType,
    SqliteProduct,
    SqliteProductProductVariant,
    SqliteProductTranslation,
    SqliteProductType,
    SqliteProductVariant,
]


class SqliteModelMapper:
    mapping: ClassVar[Dict[Type[StoredBaseModel], Type[Base]]] = {
        sqlite_model.Meta.origin_model: sqlite_model
        for sqlite_model in _sqlite_models
    }

    @classmethod
    def map(cls, model_class: Type[StoredBaseModel]) -> Type[Base]:
        return cls.mapping[model_class]
