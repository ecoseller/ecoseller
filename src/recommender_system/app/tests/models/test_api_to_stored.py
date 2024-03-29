from datetime import datetime
from typing import Any, Dict
from unittest import TestCase

import pytest

from recommender_system.models.api.attribute import Attribute
from recommender_system.models.api.attribute_type import AttributeType
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
from recommender_system.models.stored.model.config import ConfigModel
from recommender_system.models.stored.product.attribute import AttributeModel
from recommender_system.models.stored.product.attribute_type import AttributeTypeModel
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
from tests.models.data import api_data, stored_data


@pytest.fixture
def prepare_product_variants():
    variants = [
        ProductVariantModel(
            sku=str(i),
            ean=str(i),
            weight=1.0,
            stock_quantity=1,
            recommendation_weight=1.0,
            update_at=datetime.now(),
            create_at=datetime.now(),
        )
        for i in range(3)
    ]

    for variant in variants:
        variant.save()

    yield

    for variant in variants:
        variant.delete()


def str_to_datetime(data: Dict[str, Any]) -> Dict[str, Any]:
    for field in ["create_at", "update_at"]:
        if field in data:
            data[field] = datetime.fromisoformat(data[field])
    return data


def test_attribute():
    attribute = Attribute.parse_obj(api_data[Attribute])
    model = AttributeModel.from_api_model(model=attribute)

    expected = str_to_datetime(stored_data[AttributeModel])
    TestCase().assertDictEqual(model.dict(), expected)


def test_attribute_type():
    attribute_type = AttributeType.parse_obj(api_data[AttributeType])
    model = AttributeTypeModel.from_api_model(model=attribute_type)

    expected = str_to_datetime(stored_data[AttributeTypeModel])

    TestCase().assertDictEqual(model.dict(), expected)


def test_config():
    config = Config.parse_obj(api_data[Config])
    model = ConfigModel.from_api_model(model=config)

    expected = str_to_datetime(stored_data[ConfigModel])
    TestCase().assertDictEqual(model.dict(), expected)


def test_order(prepare_product_variants):
    _ = prepare_product_variants

    order = Order.parse_obj(api_data[Order])
    order.save()
    model = OrderModel.get(pk=order.token)

    expected = str_to_datetime(stored_data[OrderModel])

    TestCase().assertDictEqual(model.dict(), expected)

    assert len(model.product_variants) == len(order.product_variants)


def test_product():
    product = Product.parse_obj(api_data[Product])
    model = ProductModel.from_api_model(model=product)

    expected = str_to_datetime(stored_data[ProductModel])

    TestCase().assertDictEqual(model.dict(), expected)


def test_product_add_to_cart():
    patc = ProductAddToCart.parse_obj(api_data[ProductAddToCart])
    model = ProductAddToCartModel.from_api_model(model=patc)

    expected = str_to_datetime(stored_data[ProductAddToCartModel])

    TestCase().assertDictEqual(model.dict(), expected)


def test_product_detail_enter():
    pde = ProductDetailEnter.parse_obj(api_data[ProductDetailEnter])
    model = ProductDetailEnterModel.from_api_model(model=pde)

    expected = str_to_datetime(stored_data[ProductDetailEnterModel])

    TestCase().assertDictEqual(model.dict(), expected)


def test_product_detail_leave():
    pdl = ProductDetailLeave.parse_obj(api_data[ProductDetailLeave])
    model = ProductDetailLeaveModel.from_api_model(model=pdl)

    expected = str_to_datetime(stored_data[ProductDetailLeaveModel])

    TestCase().assertDictEqual(model.dict(), expected)


def test_product_price():
    pdl = ProductPrice.parse_obj(api_data[ProductPrice])
    model = ProductPriceModel.from_api_model(model=pdl)

    expected = str_to_datetime(stored_data[ProductPriceModel])

    TestCase().assertDictEqual(model.dict(), expected)


def test_product_translation():
    product_translation = ProductTranslation.parse_obj(api_data[ProductTranslation])
    model = ProductTranslationModel.from_api_model(
        model=product_translation, product_id=0
    )

    expected = str_to_datetime(stored_data[ProductTranslationModel])

    TestCase().assertDictEqual(model.dict(), expected)


def test_product_type():
    product_type = ProductType.parse_obj(api_data[ProductType])
    model = ProductTypeModel.from_api_model(model=product_type)

    expected = str_to_datetime(stored_data[ProductTypeModel])

    TestCase().assertDictEqual(model.dict(), expected)


def test_product_variant():
    product_variant = ProductVariant.parse_obj(api_data[ProductVariant])
    model = ProductVariantModel.from_api_model(model=product_variant)

    expected = str_to_datetime(stored_data[ProductVariantModel])

    TestCase().assertDictEqual(model.dict(), expected)


def test_recommendation_view():
    view = RecommendationView.parse_obj(api_data[RecommendationView])
    model = RecommendationViewModel.from_api_model(model=view)

    expected = str_to_datetime(stored_data[RecommendationViewModel])

    TestCase().assertDictEqual(model.dict(), expected)


def test_review():
    review = Review.parse_obj(api_data[Review])
    model = ReviewModel.from_api_model(model=review)

    expected = str_to_datetime(stored_data[ReviewModel])

    TestCase().assertDictEqual(model.dict(), expected)
