from typing import Any, Dict, Type

from recommender_system.models.api.attribute import Attribute
from recommender_system.models.api.attribute_type import AttributeType
from recommender_system.models.api.base import ApiBaseModel
from recommender_system.models.api.product import Product
from recommender_system.models.api.product_add_to_cart import ProductAddToCart
from recommender_system.models.api.product_detail_enter import ProductDetailEnter
from recommender_system.models.api.product_detail_leave import ProductDetailLeave
from recommender_system.models.api.product_translation import ProductTranslation
from recommender_system.models.api.product_type import ProductType
from recommender_system.models.api.product_variant import ProductVariant
from recommender_system.models.api.recommendation_view import RecommendationView
from recommender_system.models.api.review import Review


class DataManager:
    _model_class_map: Dict[str, Type[ApiBaseModel]] = {
        "Attribute": Attribute,
        "AttributeType": AttributeType,
        "Product": Product,
        "ProductAddToCart": ProductAddToCart,
        "ProductDetailEnter": ProductDetailEnter,
        "ProductDetailLeave": ProductDetailLeave,
        "ProductTranslation": ProductTranslation,
        "ProductType": ProductType,
        "ProductVariant": ProductVariant,
        "RecommendationView": RecommendationView,
        "Review": Review,
    }

    def store_object(self, data: Dict[str, Any]) -> None:
        model_class = self._model_class_map[data["_model_class"]]
        model = model_class.parse_obj(data)
        model.save()
