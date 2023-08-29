from typing import Any, Dict, List, Type

from recommender_system.models.api.attribute import Attribute
from recommender_system.models.api.attribute_type import AttributeType
from recommender_system.models.api.base import ApiBaseModel
from recommender_system.models.api.category import Category
from recommender_system.models.api.config import Config
from recommender_system.models.api.order import Order
from recommender_system.models.api.product import Product
from recommender_system.models.api.product_add_to_cart import ProductAddToCart
from recommender_system.models.api.product_detail_enter import ProductDetailEnter
from recommender_system.models.api.product_detail_leave import ProductDetailLeave
from recommender_system.models.api.product_price import ProductPrice
from recommender_system.models.api.product_translation import ProductTranslation
from recommender_system.models.api.product_type import ProductType
from recommender_system.models.api.product_variant import ProductVariant
from recommender_system.models.api.recommendation_view import RecommendationView
from recommender_system.models.api.review import Review
from recommender_system.models.api.trainer_queue_item import TrainerQueueItem


class DataManager:
    _model_class_map: Dict[str, Type[ApiBaseModel]] = {
        "Attribute": Attribute,
        "AttributeType": AttributeType,
        "Category": Category,
        "Config": Config,
        "Order": Order,
        "Product": Product,
        "ProductAddToCart": ProductAddToCart,
        "ProductDetailEnter": ProductDetailEnter,
        "ProductDetailLeave": ProductDetailLeave,
        "ProductPrice": ProductPrice,
        "ProductTranslation": ProductTranslation,
        "ProductType": ProductType,
        "ProductVariant": ProductVariant,
        "RecommendationView": RecommendationView,
        "Review": Review,
        "TrainerQueueItem": TrainerQueueItem,
    }

    def store_object(self, data: Dict[str, Any]) -> None:
        model_class = self._model_class_map[data["_model_class"]]
        model = model_class.parse_obj(data)
        model.save()

    def store_objects(self, data: List[Dict[str, Any]]) -> None:
        for item in data:
            model_class = self._model_class_map[item["_model_class"]]
            model = model_class.parse_obj(item)
            model.save()
