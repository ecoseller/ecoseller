from unittest import TestCase

import pytest

from recommender_system.models.stored.attribute_type import AttributeTypeModel
from recommender_system.models.stored.attribute_type_product_type import (
    AttributeTypeProductTypeModel,
)
from recommender_system.models.stored.product import ProductModel
from recommender_system.models.stored.product_variant import ProductVariantModel
from recommender_system.storage import ModelNotFoundException
from tests.storage.tools import get_or_create_model, delete_model, default_dicts


def delete_products(product_type_pk: int):
    for product in ProductModel.gets(product_type_pk=product_type_pk):
        product.delete()


def delete_attribute_types(product_type_pk: int):
    for atpt in AttributeTypeProductTypeModel.gets(product_type_pk=product_type_pk):
        try:
            AttributeTypeModel.get(pk=atpt.attribute_type_pk).delete()
        except ModelNotFoundException:
            pass
        atpt.delete()


@pytest.fixture
def clear_product_variant():
    product_variant_sku = "sku"
    product = get_or_create_model(model_class=ProductModel)

    delete_model(model_class=ProductVariantModel, pk=product_variant_sku)

    yield product_variant_sku, product.pk

    delete_model(model_class=ProductVariantModel, pk=product_variant_sku)
    delete_model(model_class=ProductModel, pk=product.pk)


@pytest.fixture
def create_product_variant():
    product = get_or_create_model(model_class=ProductModel)
    product_variant = get_or_create_model(model_class=ProductVariantModel)

    yield product_variant.pk

    delete_model(model_class=ProductVariantModel, pk=product_variant.pk)
    delete_model(model_class=ProductModel, pk=product.pk)


def test_product_variant_create(clear_product_variant):
    product_variant_sku, product_pk = clear_product_variant
    product_variant_dict = default_dicts[ProductVariantModel]

    with pytest.raises(ModelNotFoundException):
        _ = ProductVariantModel.get(pk=product_variant_sku)

    product_variant = ProductVariantModel.parse_obj(product_variant_dict)
    product_variant.create()

    stored_product_variant = ProductVariantModel.get(pk=product_variant_sku)

    TestCase().assertDictEqual(stored_product_variant.dict(), product_variant.dict())


def test_product_variant_update(create_product_variant):
    product_variant_sku = create_product_variant
    product_variant = ProductVariantModel.get(pk=product_variant_sku)

    assert product_variant.ean != "unittest"

    product_variant.ean = "unittest"
    product_variant.save()

    stored_product_variant = ProductVariantModel.get(pk=product_variant.pk)

    assert stored_product_variant.pk == product_variant.pk
    assert stored_product_variant.ean == "unittest"


def test_product_variant_refresh(create_product_variant):
    product_variant_sku = create_product_variant
    product_variant = ProductVariantModel.get(pk=product_variant_sku)

    modified_product_variant = product_variant.copy()
    modified_product_variant.ean = "unittest"
    modified_product_variant.save()

    assert modified_product_variant.ean == "unittest"
    assert product_variant.ean != "unittest"

    product_variant.refresh()

    assert product_variant.ean == modified_product_variant.ean


def test_product_variant_delete(create_product_variant):
    product_variant_sku = create_product_variant
    product_variant = ProductVariantModel.get(pk=product_variant_sku)

    product_variant.delete()

    with pytest.raises(ModelNotFoundException):
        _ = ProductVariantModel.get(pk=product_variant_sku)
