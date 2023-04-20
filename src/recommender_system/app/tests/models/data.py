from datetime import datetime
from typing import Any, Dict, List, Optional, Type

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
from recommender_system.models.stored.attribute import AttributeModel
from recommender_system.models.stored.attribute_type import AttributeTypeModel
from recommender_system.models.stored.base import StoredBaseModel
from recommender_system.models.stored.product import ProductModel
from recommender_system.models.stored.product_add_to_cart import (
    ProductAddToCartModel,
)
from recommender_system.models.stored.product_detail_enter import (
    ProductDetailEnterModel,
)
from recommender_system.models.stored.product_detail_leave import (
    ProductDetailLeaveModel,
)
from recommender_system.models.stored.product_translation import ProductTranslationModel
from recommender_system.models.stored.product_type import ProductTypeModel
from recommender_system.models.stored.product_variant import ProductVariantModel
from recommender_system.models.stored.recommendation_view import RecommendationViewModel
from recommender_system.models.stored.review import ReviewModel


_now = datetime.now().isoformat()


def _attribute_type(id: int = 0) -> Dict[str, Any]:
    return {"id": id, "type_name": "type_name", "unit": "unit"}


def _root_attribute() -> Dict[str, Any]:
    return {
        "id": 0,
        "type": 0,
        "value": "value 1",
        "order": 0,
        "ext_attributes": list(range(1, 3)),
    }


def _attribute_model(id: int = 0, parent_id: Optional[int] = None) -> Dict[str, Any]:
    return {
        "id": id,
        "value": "value 1",
        "order": id,
        "attribute_type_id": id,
        "parent_attribute_id": parent_id,
    }


def _product_translation(id: int = 0) -> Dict[str, Any]:
    return {
        "id": id,
        "language_code": "en",
        "title": "title",
        "meta_title": "meta_title",
        "meta_description": "meta_description",
        "short_description": "short_description",
        "description": "description",
        "slug": "slug",
    }


def _product_translation_model(id: int = 0, product_id: int = 0) -> Dict[str, Any]:
    result = _product_translation(id=id)
    result["product_id"] = product_id
    return result


def _product_variant_model(sku: str = "sku") -> Dict[str, Any]:
    return {
        "sku": sku,
        "ean": "ean",
        "weight": 0,
        "update_at": _now,
        "create_at": _now,
    }


def _product_variant(sku: str = "sku") -> Dict[str, Any]:
    result = _product_variant_model(sku=sku)
    result["attributes"] = [_root_attribute()]
    return result


def _product_raw(id: int = 0) -> Dict[str, Any]:
    return {
        "id": id,
        "published": True,
        "category_id": 0,
        "update_at": _now,
        "create_at": _now,
    }


def _product_type_empty(id: int = 0) -> Dict[str, Any]:
    return {"id": id, "name": "name", "update_at": _now, "create_at": _now}


def _product(id: int = 0, product_type_id: int = 0) -> Dict[str, Any]:
    result = _product_raw(id=id)
    result["type_id"] = product_type_id
    result["product_translations"] = [_product_translation(id=i) for i in range(1, 3)]
    result["product_variants"] = list(range(1, 3))
    return result


def _product_model(id: int = 0, product_type_id: int = 0) -> Dict[str, Any]:
    result = _product_raw(id=id)
    result["product_type_id"] = product_type_id
    return result


def _product_type(id: int = 0) -> Dict[str, Any]:
    result = _product_type_empty(id=id)
    result["products"] = list(range(1, 3))
    result["attribute_types"] = list(range(1, 3))
    return result


def _product_add_to_cart(
    id: Optional[int] = None,
    session_id: str = "session",
    user_id: Optional[int] = 0,
    product_id: int = 0,
    product_variant_sku: str = "sku",
) -> Dict[str, Any]:
    return {
        "id": id,
        "session_id": session_id,
        "user_id": user_id,
        "product_id": product_id,
        "product_variant_sku": product_variant_sku,
        "create_at": _now,
    }


def _product_detail_enter(
    id: Optional[int] = None,
    session_id: str = "session",
    user_id: Optional[int] = 0,
    product_id: int = 0,
    product_variant_sku: str = "sku",
) -> Dict[str, Any]:
    return {
        "id": id,
        "session_id": session_id,
        "user_id": user_id,
        "product_id": product_id,
        "product_variant_sku": product_variant_sku,
        "recommendation_type": "cart",
        "position": 1,
        "create_at": _now,
    }


def _product_detail_leave(
    id: Optional[int] = None,
    session_id: str = "session",
    user_id: Optional[int] = 0,
    product_id: int = 0,
    product_variant_sku: str = "sku",
) -> Dict[str, Any]:
    return {
        "id": id,
        "session_id": session_id,
        "user_id": user_id,
        "product_id": product_id,
        "product_variant_sku": product_variant_sku,
        "time_spent": 13.5,
        "create_at": _now,
    }


def _recommendation_view(
    id: Optional[int] = None,
    session_id: str = "session",
    user_id: Optional[int] = 0,
    product_id: int = 0,
    product_variant_sku: str = "sku",
) -> Dict[str, Any]:
    return {
        "id": id,
        "session_id": session_id,
        "user_id": user_id,
        "product_id": product_id,
        "product_variant_sku": product_variant_sku,
        "recommendation_type": "cart",
        "position": 1,
        "create_at": _now,
    }


def _review(
    id: int = 0,
    session_id: str = "session",
    user_id: int = 0,
    product_id: int = 0,
    product_variant_sku: str = "sku",
) -> Dict[str, Any]:
    return {
        "id": id,
        "session_id": session_id,
        "user_id": user_id,
        "product_id": product_id,
        "product_variant_sku": product_variant_sku,
        "rating": 4,
        "update_at": _now,
        "create_at": _now,
    }


api_data: Dict[Type[ApiBaseModel], Any] = {
    Attribute: _root_attribute(),
    AttributeType: _attribute_type(),
    Product: _product(),
    ProductAddToCart: _product_add_to_cart(),
    ProductDetailEnter: _product_detail_enter(),
    ProductDetailLeave: _product_detail_leave(),
    ProductTranslation: _product_translation(),
    ProductType: _product_type(),
    ProductVariant: _product_variant(),
    RecommendationView: _recommendation_view(),
    Review: _review(),
}


stored_data: Dict[Type[StoredBaseModel], Any] = {
    AttributeModel: _attribute_model(),
    AttributeTypeModel: _attribute_type(),
    ProductModel: _product_model(),
    ProductAddToCartModel: _product_add_to_cart(),
    ProductDetailEnterModel: _product_detail_enter(),
    ProductDetailLeaveModel: _product_detail_leave(),
    ProductTypeModel: _product_type_empty(),
    ProductTranslationModel: _product_translation_model(),
    ProductVariantModel: _product_variant_model(),
    RecommendationViewModel: _recommendation_view(),
    ReviewModel: _review(),
}
