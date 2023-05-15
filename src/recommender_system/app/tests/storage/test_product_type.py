from unittest import TestCase

import pytest

from recommender_system.models.stored.product.attribute_type import AttributeTypeModel
from recommender_system.models.stored.product.attribute_type_product_type import (
    AttributeTypeProductTypeModel,
)
from recommender_system.models.stored.product.product import ProductModel
from recommender_system.models.stored.product.product_type import ProductTypeModel
from tests.storage.tools import get_or_create_model, delete_model, default_dicts


def delete_products(product_type_pk: int):
    for product in ProductModel.gets(product_type_id=product_type_pk):
        product.delete()


def delete_attribute_types(product_type_pk: int):
    for atpt in AttributeTypeProductTypeModel.gets(product_type_id=product_type_pk):
        try:
            AttributeTypeModel.get(pk=atpt.attribute_type_id).delete()
        except AttributeTypeModel.DoesNotExist:
            pass
        atpt.delete()


@pytest.fixture
def clear_product_type():
    product_type_pk = 0
    product_type = get_or_create_model(model_class=ProductTypeModel)

    delete_model(model_class=ProductTypeModel, pk=product_type_pk)

    yield product_type_pk

    delete_products(product_type_pk=product_type_pk)
    delete_attribute_types(product_type_pk=product_type_pk)
    delete_model(model_class=ProductTypeModel, pk=product_type.pk)


@pytest.fixture
def create_product_type():
    product_type = get_or_create_model(model_class=ProductTypeModel)

    yield product_type.pk

    delete_products(product_type_pk=product_type.pk)
    delete_attribute_types(product_type_pk=product_type.pk)
    delete_model(model_class=ProductTypeModel, pk=product_type.pk)


def test_product_type_create(clear_product_type):
    product_type_pk = clear_product_type
    product_type_dict = default_dicts[ProductTypeModel]

    with pytest.raises(ProductTypeModel.DoesNotExist):
        _ = ProductTypeModel.get(pk=product_type_pk)

    product_type = ProductTypeModel.parse_obj(product_type_dict)
    product_type.create()

    stored_product_type = ProductTypeModel.get(pk=product_type_pk)

    TestCase().assertDictEqual(stored_product_type.dict(), product_type.dict())


def test_product_type_update(create_product_type):
    product_pk = create_product_type
    product_type = ProductTypeModel.get(pk=product_pk)

    assert product_type.name != "unittest"

    product_type.name = "unittest"
    product_type.save()

    stored_product_type = ProductTypeModel.get(pk=product_type.pk)

    assert stored_product_type.pk == product_type.pk
    assert stored_product_type.name == "unittest"


def test_product_type_refresh(create_product_type):
    product_type_pk = create_product_type
    product_type = ProductTypeModel.get(pk=product_type_pk)

    modified_product = product_type.copy()
    modified_product.name = "unittest"
    modified_product.save()

    assert modified_product.name == "unittest"
    assert product_type.name != "unittest"

    product_type.refresh()

    assert product_type.name == "unittest"


def test_product_type_delete(create_product_type):
    product_type_pk = create_product_type
    product_type = ProductTypeModel.get(pk=product_type_pk)

    product_type.delete()

    with pytest.raises(ProductTypeModel.DoesNotExist):
        _ = ProductTypeModel.get(pk=product_type_pk)


def test_product_type_products(create_product_type):
    product_type_pk = create_product_type
    product_type = ProductTypeModel.get(pk=product_type_pk)

    product_dict = default_dicts[ProductModel]
    product_dict["product_type_id"] = product_type_pk

    old_products = len(product_type.products)

    product = ProductModel.parse_obj(product_dict)
    product.id = None
    product.create()

    assert len(product_type.products) == old_products + 1


def test_product_type_attribute_types(create_product_type):
    product_type_pk = create_product_type
    product_type = ProductTypeModel.get(pk=product_type_pk)

    attribute_type_dict = default_dicts[AttributeTypeModel]

    old_attribute_types = len(product_type.attribute_types)

    attribute_type = AttributeTypeModel.parse_obj(attribute_type_dict)
    attribute_type.id = None
    attribute_type.create()

    product_type.add_attribute_type(attribute_type=attribute_type)

    assert len(product_type.attribute_types) == old_attribute_types + 1
