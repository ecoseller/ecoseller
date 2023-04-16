from datetime import datetime
from typing import Any, Dict, List
from unittest import TestCase

from recommender_system.models.api.attribute import Attribute
from recommender_system.models.api.attribute_type import AttributeType
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
from tests.models.data import api_data, stored_data


def str_to_datetime(data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    for element in data:
        for field in ["create_at", "update_at"]:
            if field in element:
                element[field] = datetime.fromisoformat(element[field])
    return data


def test_attribute():
    attribute = Attribute.parse_obj(api_data[Attribute])
    models = AttributeModel.from_api_model(model=attribute)

    expected_dicts = str_to_datetime(stored_data[AttributeModel])
    assert len(models) == len(expected_dicts)

    for created, expected in zip(models, expected_dicts):
        TestCase().assertDictEqual(created.dict(), expected)


def test_attribute_type():
    attribute_type = AttributeType.parse_obj(api_data[AttributeType])
    models = AttributeTypeModel.from_api_model(model=attribute_type)

    expected_dicts = str_to_datetime(stored_data[AttributeTypeModel])
    assert len(models) == len(expected_dicts)

    for created, expected in zip(models, expected_dicts):
        TestCase().assertDictEqual(created.dict(), expected)


def test_product():
    product = Product.parse_obj(api_data[Product])
    models = ProductModel.from_api_model(model=product)

    expected_dicts = str_to_datetime(stored_data[ProductModel])
    assert len(models) == len(expected_dicts)

    for created, expected in zip(models, expected_dicts):
        TestCase().assertDictEqual(created.dict(), expected)


def test_product_add_to_cart():
    patc = ProductAddToCart.parse_obj(api_data[ProductAddToCart])
    models = ProductAddToCartModel.from_api_model(model=patc)

    expected_dicts = str_to_datetime(stored_data[ProductAddToCartModel])
    assert len(models) == len(expected_dicts)

    for created, expected in zip(models, expected_dicts):
        TestCase().assertDictEqual(created.dict(), expected)


def test_product_detail_enter():
    pde = ProductDetailEnter.parse_obj(api_data[ProductDetailEnter])
    models = ProductDetailEnterModel.from_api_model(model=pde)

    expected_dicts = str_to_datetime(stored_data[ProductDetailEnterModel])
    assert len(models) == len(expected_dicts)

    for created, expected in zip(models, expected_dicts):
        TestCase().assertDictEqual(created.dict(), expected)


def test_product_detail_leave():
    pdl = ProductDetailLeave.parse_obj(api_data[ProductDetailLeave])
    models = ProductDetailLeaveModel.from_api_model(model=pdl)

    expected_dicts = str_to_datetime(stored_data[ProductDetailLeaveModel])
    assert len(models) == len(expected_dicts)

    for created, expected in zip(models, expected_dicts):
        TestCase().assertDictEqual(created.dict(), expected)


def test_product_translation():
    product_translation = ProductTranslation.parse_obj(api_data[ProductTranslation])
    models = ProductTranslationModel.from_api_model(
        model=product_translation, product_id=0
    )

    expected_dicts = str_to_datetime(stored_data[ProductTranslationModel])
    assert len(models) == len(expected_dicts)

    for created, expected in zip(models, expected_dicts):
        TestCase().assertDictEqual(created.dict(), expected)


def test_product_type():
    product_type = ProductType.parse_obj(api_data[ProductType])
    models = ProductTypeModel.from_api_model(model=product_type)

    expected_dicts = str_to_datetime(stored_data[ProductTypeModel])
    assert len(models) == len(expected_dicts)

    for created, expected in zip(models, expected_dicts):
        TestCase().assertDictEqual(created.dict(), expected)


def test_product_variant():
    product_variant = ProductVariant.parse_obj(api_data[ProductVariant])
    models = ProductVariantModel.from_api_model(model=product_variant)

    expected_dicts = str_to_datetime(stored_data[ProductVariantModel])
    assert len(models) == len(expected_dicts)

    for created, expected in zip(models, expected_dicts):
        TestCase().assertDictEqual(created.dict(), expected)


def test_recommendation_view():
    view = RecommendationView.parse_obj(api_data[RecommendationView])
    models = RecommendationViewModel.from_api_model(model=view)

    expected_dicts = str_to_datetime(stored_data[RecommendationViewModel])
    assert len(models) == len(expected_dicts)

    for created, expected in zip(models, expected_dicts):
        TestCase().assertDictEqual(created.dict(), expected)


def test_review():
    review = Review.parse_obj(api_data[Review])
    models = ReviewModel.from_api_model(model=review)

    expected_dicts = str_to_datetime(stored_data[ReviewModel])
    assert len(models) == len(expected_dicts)

    for created, expected in zip(models, expected_dicts):
        TestCase().assertDictEqual(created.dict(), expected)
