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
from recommender_system.storage.sql.models.model import (
    ModelBase,
    SQLLatestIdentifier,
    SQLTrainerQueueItem,
)
from recommender_system.storage.sql.models.products import (
    ProductBase,
    SQLAttribute,
    SQLAttributeProductVariant,
    SQLAttributeType,
    SQLAttributeTypeProductType,
    SQLCategoryAncestor,
    SQLOrder,
    SQLOrderProductVariant,
    SQLProduct,
    SQLProductPrice,
    SQLProductProductVariant,
    SQLProductTranslation,
    SQLProductType,
    SQLProductVariant,
)
from recommender_system.storage.sql.models.similarity import SimilarityBase, SQLDistance


Base = Union[
    Type[FeedbackBase], Type[ProductBase], Type[ModelBase], Type[SimilarityBase]
]


_sql_models = [
    SQLProductAddToCart,
    SQLProductDetailEnter,
    SQLProductDetailLeave,
    SQLRecommendationView,
    SQLReview,
    SQLSession,
    SQLLatestIdentifier,
    SQLTrainerQueueItem,
    SQLAttribute,
    SQLAttributeProductVariant,
    SQLAttributeType,
    SQLAttributeTypeProductType,
    SQLCategoryAncestor,
    SQLOrder,
    SQLOrderProductVariant,
    SQLProduct,
    SQLProductPrice,
    SQLProductProductVariant,
    SQLProductTranslation,
    SQLProductType,
    SQLProductVariant,
    SQLDistance,
]


class SQLModelMapper:
    mapping: ClassVar[Dict[Type[StoredBaseModel], Type[Base]]] = {
        sql_model.Meta.origin_model: sql_model for sql_model in _sql_models
    }

    @classmethod
    def map(cls, model_class: Type[StoredBaseModel]) -> Type[Base]:
        return cls.mapping[model_class]
