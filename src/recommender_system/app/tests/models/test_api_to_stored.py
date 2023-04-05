from unittest import TestCase

from recommender_system.models.api.attribute import Attribute
from recommender_system.models.api.attribute_type import AttributeType
from recommender_system.models.api.product import Product
from recommender_system.models.api.product_translation import ProductTranslation
from recommender_system.models.api.product_type import ProductType
from recommender_system.models.api.product_variant import ProductVariant
from recommender_system.models.stored.attribute import AttributeModel
from recommender_system.models.stored.attribute_type import AttributeTypeModel
from recommender_system.models.stored.product import ProductModel
from recommender_system.models.stored.product_translation import ProductTranslationModel
from recommender_system.models.stored.product_type import ProductTypeModel
from recommender_system.models.stored.product_variant import ProductVariantModel
from tests.models.data import api_data, stored_data


def test_attribute():
    attribute = Attribute.parse_obj(api_data[Attribute])
    models = AttributeModel.from_api_model(model=attribute)

    expected_dicts = stored_data[AttributeModel]
    assert len(models) == len(expected_dicts)

    for created, expected in zip(models, expected_dicts):
        TestCase().assertDictEqual(created.dict(), expected)


def test_attribute_type():
    attribute_type = AttributeType.parse_obj(api_data[AttributeType])
    models = AttributeTypeModel.from_api_model(model=attribute_type)

    expected_dicts = stored_data[AttributeTypeModel]
    assert len(models) == len(expected_dicts)

    for created, expected in zip(models, expected_dicts):
        TestCase().assertDictEqual(created.dict(), expected)


def test_product():
    product = Product.parse_obj(api_data[Product])
    models = ProductModel.from_api_model(model=product)

    expected_dicts = stored_data[ProductModel]
    assert len(models) == len(expected_dicts)

    for created, expected in zip(models, expected_dicts):
        TestCase().assertDictEqual(created.dict(), expected)


def test_product_translation():
    product_translation = ProductTranslation.parse_obj(api_data[ProductTranslation])
    models = ProductTranslationModel.from_api_model(
        model=product_translation, product_id=0
    )

    expected_dicts = stored_data[ProductTranslationModel]
    assert len(models) == len(expected_dicts)

    for created, expected in zip(models, expected_dicts):
        TestCase().assertDictEqual(created.dict(), expected)


def test_product_type():
    product_type = ProductType.parse_obj(api_data[ProductType])
    models = ProductTypeModel.from_api_model(model=product_type)

    expected_dicts = stored_data[ProductTypeModel]
    assert len(models) == len(expected_dicts)

    for created, expected in zip(models, expected_dicts):
        TestCase().assertDictEqual(created.dict(), expected)


def test_product_variant():
    product_variant = ProductVariant.parse_obj(api_data[ProductVariant])
    models = ProductVariantModel.from_api_model(model=product_variant)

    expected_dicts = stored_data[ProductVariantModel]
    assert len(models) == len(expected_dicts)

    for created, expected in zip(models, expected_dicts):
        TestCase().assertDictEqual(created.dict(), expected)
