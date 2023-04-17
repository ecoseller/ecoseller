from typing import ClassVar, Dict, Type, Union

from recommender_system.models.stored.base import StoredBaseModel
from recommender_system.storage.sql.models.feedback import (
    FeedbackBase,
    SQLProductAddToCart,
    SQLProductDetailEnter,
    SQLProductDetailLeave,
    SQLRecommendationView,
    SQLReview,
    SQLSession,
)
from recommender_system.storage.sql.models.products import (
    SQLAttribute,
    SQLAttributeProductVariant,
    SQLAttributeType,
    SQLAttributeTypeProductType,
    ProductBase,
    SQLProduct,
    SQLProductProductVariant,
    SQLProductTranslation,
    SQLProductType,
    SQLProductVariant,
)


Base = Union[Type[FeedbackBase], Type[ProductBase]]


_sql_models = [
    SQLProductAddToCart,
    SQLProductDetailEnter,
    SQLProductDetailLeave,
    SQLRecommendationView,
    SQLReview,
    SQLSession,
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
