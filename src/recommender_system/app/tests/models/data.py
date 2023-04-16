from datetime import datetime
from typing import Any, Dict, List, Optional, Type

from recommender_system.models.api.attribute import Attribute
from recommender_system.models.api.attribute_type import AttributeType
from recommender_system.models.api.base import ApiBaseModel
from recommender_system.models.api.product import Product
from recommender_system.models.api.product_added_to_cart import ProductAddedToCart
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
from recommender_system.models.stored.product_added_to_cart import (
    ProductAddedToCartModel,
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


def _attribute(id: int = 0) -> Dict[str, Any]:
    return {
        "id": id,
        "type": _attribute_type(id=id),
        "value": "value 1",
        "order": id,
        "ext_attributes": [],
    }


def _root_attribute() -> Dict[str, Any]:
    return {
        "id": 0,
        "type": _attribute_type(),
        "value": "value 1",
        "order": 0,
        "ext_attributes": [_attribute(id=i) for i in range(1, 3)],
    }


def _attribute_model(id: int = 0, parent_id: Optional[int] = None) -> Dict[str, Any]:
    return {
        "id": id,
        "value": "value 1",
        "order": id,
        "attribute_type_id": id,
        "parent_attribute_id": parent_id,
    }


def _attribute_product_variant(
    attribute_id: int, product_variant_sku: str
) -> Dict[str, Any]:
    return {
        "id": None,
        "attribute_id": attribute_id,
        "product_variant_sku": product_variant_sku,
    }


def _attribute_type_product_type(
    attribute_type_id: int = 0, product_type_id: int = 0
) -> Dict[str, Any]:
    return {
        "id": None,
        "attribute_type_id": attribute_type_id,
        "product_type_id": product_type_id,
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


def _product_variant_model_related(sku: str = "sku") -> List[Dict[str, Any]]:
    return [
        _attribute_type(),
        _attribute_model(),
        _attribute_type(1),
        _attribute_model(1, 0),
        _attribute_type(2),
        _attribute_model(2, 0),
        _attribute_product_variant(0, sku),
    ]


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
    result["product_variants"] = [_product_variant(sku=f"sku{i}") for i in range(1, 3)]
    return result


def _product_model(id: int = 0, product_type_id: int = 0) -> Dict[str, Any]:
    result = _product_raw(id=id)
    result["product_type_id"] = product_type_id
    return result


def _product_product_variant(
    product_id: int = 0, product_variant_sku: str = "sku"
) -> Dict[str, Any]:
    return {
        "id": None,
        "product_id": product_id,
        "product_variant_sku": product_variant_sku,
    }


def _product_type(id: int = 0) -> Dict[str, Any]:
    result = _product_type_empty(id=id)
    result["products"] = [_product(id=i) for i in range(1, 3)]
    result["attribute_types"] = [_attribute_type(id=i) for i in range(1, 3)]
    return result


def _product_model_related(product_id: int = 0) -> List[Dict[str, Any]]:
    return [
        _product_translation_model(1, product_id),
        _product_translation_model(2, product_id),
        _product_variant_model("sku1"),
        *_product_variant_model_related("sku1"),
        _product_product_variant(product_id, "sku1"),
        _product_variant_model("sku2"),
        *_product_variant_model_related("sku2"),
        _product_product_variant(product_id, "sku2"),
    ]


def _product_added_to_cart(
    session_id: str = "session", user_id: Optional[int] = 0, product_id: int = 0
) -> Dict[str, Any]:
    return {
        "session_id": session_id,
        "user_id": user_id,
        "product_id": product_id,
        "create_at": _now,
    }


def _product_detail_enter(
    session_id: str = "session", user_id: Optional[int] = 0, product_id: int = 0
) -> Dict[str, Any]:
    return {
        "session_id": session_id,
        "user_id": user_id,
        "product_id": product_id,
        "recommendation_type": "cart",
        "position": 1,
        "create_at": _now,
    }


def _product_detail_leave(
    session_id: str = "session", user_id: Optional[int] = 0, product_id: int = 0
) -> Dict[str, Any]:
    return {
        "session_id": session_id,
        "user_id": user_id,
        "product_id": product_id,
        "time_spent": 13.5,
        "create_at": _now,
    }


def _recommendation_view(
    session_id: str = "session", user_id: Optional[int] = 0, product_id: int = 0
) -> Dict[str, Any]:
    return {
        "session_id": session_id,
        "user_id": user_id,
        "product_id": product_id,
        "recommendation_type": "cart",
        "position": 1,
        "create_at": _now,
    }


def _review(
    id: int = 0, session_id: str = "session", user_id: int = 0, product_id: int = 0
) -> Dict[str, Any]:
    return {
        "id": id,
        "session_id": session_id,
        "user_id": user_id,
        "product_id": product_id,
        "rating": 4,
        "update_at": _now,
        "create_at": _now,
    }


api_data: Dict[Type[ApiBaseModel], Any] = {
    Attribute: _root_attribute(),
    AttributeType: _attribute_type(),
    Product: _product(),
    ProductAddedToCart: _product_added_to_cart(),
    ProductDetailEnter: _product_detail_enter(),
    ProductDetailLeave: _product_detail_leave(),
    ProductTranslation: _product_translation(),
    ProductType: _product_type(),
    ProductVariant: _product_variant(),
    RecommendationView: _recommendation_view(),
    Review: _review(),
}


stored_data: Dict[Type[StoredBaseModel], Any] = {
    AttributeModel: [
        _attribute_type(),
        _attribute_model(),
        _attribute_type(1),
        _attribute_model(1, 0),
        _attribute_type(2),
        _attribute_model(2, 0),
    ],
    AttributeTypeModel: [_attribute_type()],
    ProductModel: [_product_model(), *_product_model_related()],
    ProductAddedToCartModel: [_product_added_to_cart()],
    ProductDetailEnterModel: [_product_detail_enter()],
    ProductDetailLeaveModel: [_product_detail_leave()],
    ProductTypeModel: [
        _product_type_empty(),
        _product_model(1),
        *_product_model_related(1),
        _product_model(2),
        *_product_model_related(2),
        _attribute_type(1),
        _attribute_type_product_type(1, 0),
        _attribute_type(2),
        _attribute_type_product_type(2, 0),
    ],
    ProductTranslationModel: [_product_translation_model()],
    ProductVariantModel: [_product_variant_model(), *_product_variant_model_related()],
    RecommendationViewModel: [_recommendation_view()],
    ReviewModel: [_review()],
}
