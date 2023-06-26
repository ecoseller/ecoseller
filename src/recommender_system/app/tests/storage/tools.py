from datetime import datetime
from typing import Any, Dict, Type

from recommender_system.models.stored.model.config import ConfigModel
from recommender_system.models.stored.product.attribute import AttributeModel
from recommender_system.models.stored.product.attribute_type import AttributeTypeModel
from recommender_system.models.stored.base import StoredBaseModel
from recommender_system.models.stored.product.order import OrderModel
from recommender_system.models.stored.product.product import ProductModel
from recommender_system.models.stored.feedback.product_add_to_cart import (
    ProductAddToCartModel,
)
from recommender_system.models.stored.feedback.product_detail_enter import (
    ProductDetailEnterModel,
)
from recommender_system.models.stored.feedback.product_detail_leave import (
    ProductDetailLeaveModel,
)
from recommender_system.models.stored.product.product_price import ProductPriceModel
from recommender_system.models.stored.product.product_translation import (
    ProductTranslationModel,
)
from recommender_system.models.stored.product.product_type import ProductTypeModel
from recommender_system.models.stored.product.product_variant import ProductVariantModel
from recommender_system.models.stored.feedback.recommendation_view import (
    RecommendationViewModel,
)
from recommender_system.models.stored.feedback.review import ReviewModel


default_dicts: Dict[Type[StoredBaseModel], Any] = {
    AttributeTypeModel: {
        "id": 0,
        "type": AttributeTypeModel.Type.CATEGORICAL,
        "type_name": "weight",
        "unit": "kg",
    },
    AttributeModel: {
        "id": 0,
        "raw_value": "1",
        "attribute_type_id": 0,
        "parent_attribute_id": None,
    },
    ConfigModel: {"id": 0, "create_at": datetime.now(), "retrieval_size": 1000},
    OrderModel: {
        "id": 0,
        "session_id": "session",
        "update_at": datetime.now(),
        "create_at": datetime.now(),
    },
    ProductModel: {
        "id": 0,
        "published": True,
        "category_id": 0,
        "update_at": datetime.now(),
        "create_at": datetime.now(),
    },
    ProductAddToCartModel: {
        "id": None,
        "session_id": "session",
        "user_id": 0,
        "product_id": 0,
        "product_variant_sku": "sku",
        "create_at": datetime.now(),
    },
    ProductDetailEnterModel: {
        "id": None,
        "session_id": "session",
        "user_id": 0,
        "product_id": 0,
        "product_variant_sku": "sku",
        "recommendation_type": "cart",
        "model_identifier": "unittest",
        "position": 1,
        "create_at": datetime.now(),
    },
    ProductDetailLeaveModel: {
        "id": None,
        "session_id": "session",
        "user_id": 0,
        "product_id": 0,
        "product_variant_sku": "sku",
        "time_spent": 13.5,
        "create_at": datetime.now(),
    },
    ProductPriceModel: {
        "id": 0,
        "price_list_code": "CZK_maloobchod",
        "product_variant_sku": "sku",
        "price": 100.0,
        "update_at": datetime.now(),
        "create_at": datetime.now(),
    },
    ProductTranslationModel: {
        "id": 0,
        "language_code": "en",
        "title": "title",
        "meta_title": "meta_title",
        "meta_description": "meta_description",
        "short_description": "short_description",
        "description": "description",
        "slug": "slug",
        "product_id": 0,
    },
    ProductTypeModel: {
        "id": 0,
        "name": "1",
        "update_at": datetime.now(),
        "create_at": datetime.now(),
    },
    ProductVariantModel: {
        "sku": "sku",
        "ean": "ean",
        "weight": 0.0,
        "stock_quantity": 1,
        "recommendation_weight": 1.0,
        "update_at": datetime.now(),
        "create_at": datetime.now(),
        "product_id": 0,
    },
    RecommendationViewModel: {
        "id": None,
        "session_id": "session",
        "user_id": 0,
        "product_id": 0,
        "product_variant_sku": "sku",
        "recommendation_type": 1,
        "model_identifier": "unittest",
        "position": 1,
        "create_at": datetime.now(),
    },
    ReviewModel: {
        "id": 0,
        "session_id": "session",
        "user_id": 0,
        "product_id": 0,
        "product_variant_sku": "sku",
        "rating": 4,
        "update_at": datetime.now(),
        "create_at": datetime.now(),
    },
}


def get_or_create_model(model_class: Type[StoredBaseModel]) -> StoredBaseModel:
    model = model_class.parse_obj(default_dicts[model_class])
    try:
        model = model_class.get(pk=model.pk)
    except model_class.DoesNotExist:
        model.create()
    return model


def delete_model(model_class: Type[StoredBaseModel], **kwargs: Any) -> None:
    try:
        model = model_class.get(**kwargs)
        model.delete()
    except TypeError:
        model._storage.delete_object(model=model)
    except model_class.DoesNotExist:
        pass
