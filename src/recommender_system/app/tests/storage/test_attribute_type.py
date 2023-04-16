from unittest import TestCase

import pytest

from recommender_system.models.stored.attribute import AttributeModel
from recommender_system.models.stored.attribute_type import AttributeTypeModel
from recommender_system.models.stored.attribute_type_product_type import (
    AttributeTypeProductTypeModel,
)
from recommender_system.models.stored.product_type import ProductTypeModel
from tests.storage.tools import get_or_create_model, delete_model, default_dicts


def delete_attributes(attribute_type_pk: int):
    for attribute in AttributeModel.gets(attribute_type_id=attribute_type_pk):
        attribute.delete()


def delete_product_types(attribute_type_pk: int):
    for atpt in AttributeTypeProductTypeModel.gets(attribute_type_id=attribute_type_pk):
        try:
            ProductTypeModel.get(pk=atpt.product_type_id).delete()
        except ProductTypeModel.DoesNotExist:
            pass
        atpt.delete()


@pytest.fixture
def clear_attribute_type():
    attribute_type_pk = 0
    attribute_type = get_or_create_model(model_class=AttributeTypeModel)

    delete_attributes(attribute_type_pk=attribute_type_pk)
    delete_model(model_class=AttributeTypeModel, pk=attribute_type_pk)

    yield attribute_type_pk

    delete_attributes(attribute_type_pk=attribute_type_pk)
    delete_product_types(attribute_type_pk=attribute_type_pk)
    delete_model(model_class=AttributeTypeModel, pk=attribute_type.pk)


@pytest.fixture
def create_attribute_type():
    attribute_type = get_or_create_model(model_class=AttributeTypeModel)

    yield attribute_type.pk

    delete_attributes(attribute_type_pk=attribute_type.pk)
    delete_product_types(attribute_type_pk=attribute_type.pk)
    delete_model(model_class=AttributeTypeModel, pk=attribute_type.pk)


def test_attribute_type_create(clear_attribute_type):
    attribute_type_pk = clear_attribute_type
    attribute_type_dict = default_dicts[AttributeTypeModel]
    attribute_type_dict["id"] = attribute_type_pk

    with pytest.raises(AttributeTypeModel.DoesNotExist):
        _ = AttributeTypeModel.get(pk=attribute_type_pk)

    attribute_type = AttributeTypeModel.parse_obj(attribute_type_dict)
    attribute_type.create()

    stored_attribute_type = AttributeTypeModel.get(pk=attribute_type_pk)

    TestCase().assertDictEqual(stored_attribute_type.dict(), attribute_type.dict())


def test_attribute_type_update(create_attribute_type):
    attribute_pk = create_attribute_type
    attribute_type = AttributeTypeModel.get(pk=attribute_pk)

    assert attribute_type.type_name != "unittest"

    attribute_type.type_name = "unittest"
    attribute_type.save()

    stored_attribute_type = AttributeTypeModel.get(pk=attribute_type.pk)

    assert stored_attribute_type.pk == attribute_type.pk
    assert stored_attribute_type.type_name == "unittest"


def test_attribute_type_refresh(create_attribute_type):
    attribute_type_pk = create_attribute_type
    attribute_type = AttributeTypeModel.get(pk=attribute_type_pk)

    modified_attribute = attribute_type.copy()
    modified_attribute.type_name = "unittest"
    modified_attribute.save()

    assert modified_attribute.type_name == "unittest"
    assert attribute_type.type_name != "unittest"

    attribute_type.refresh()

    assert attribute_type.type_name == "unittest"


def test_attribute_type_delete(create_attribute_type):
    attribute_type_pk = create_attribute_type
    attribute_type = AttributeTypeModel.get(pk=attribute_type_pk)

    attribute_type.delete()

    with pytest.raises(AttributeTypeModel.DoesNotExist):
        _ = AttributeTypeModel.get(pk=attribute_type_pk)


def test_attribute_type_attributes(create_attribute_type):
    attribute_type_pk = create_attribute_type
    attribute_type = AttributeTypeModel.get(pk=attribute_type_pk)

    attribute_dict = default_dicts[AttributeModel]

    old_attributes = len(attribute_type.attributes)

    attribute = AttributeModel.parse_obj(attribute_dict)
    attribute.id = None
    attribute.create()

    assert len(attribute_type.attributes) == old_attributes + 1


def test_attribute_type_product_types(create_attribute_type):
    attribute_type_pk = create_attribute_type
    attribute_type = AttributeTypeModel.get(pk=attribute_type_pk)

    product_type_dict = default_dicts[ProductTypeModel]

    old_product_types = len(attribute_type.product_types)

    product_type = ProductTypeModel.parse_obj(product_type_dict)
    product_type.id = None
    product_type.create()

    attribute_type.add_product_type(product_type=product_type)

    assert len(attribute_type.product_types) == old_product_types + 1
