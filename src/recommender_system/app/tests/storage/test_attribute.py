from unittest import TestCase

import pytest

from recommender_system.models.stored.attribute import AttributeModel
from recommender_system.models.stored.attribute_type import AttributeTypeModel
from recommender_system.storage import ModelNotFoundException
from tests.storage.tools import get_or_create_model, delete_model, default_dicts


def delete_ext_attributes(attribute_pk: int):
    for attribute in AttributeModel.gets(parent_attribute_id=attribute_pk):
        attribute.delete()


@pytest.fixture
def clear_attribute():
    attribute_pk = 0
    attribute_type = get_or_create_model(model_class=AttributeTypeModel)

    delete_ext_attributes(attribute_pk=attribute_pk)
    delete_model(model_class=AttributeModel, pk=attribute_pk)

    yield attribute_pk, attribute_type.pk

    delete_ext_attributes(attribute_pk=attribute_pk)
    delete_model(model_class=AttributeModel, pk=attribute_pk)
    delete_model(model_class=AttributeTypeModel, pk=attribute_type.pk)


@pytest.fixture
def create_attribute():
    attribute_type = get_or_create_model(model_class=AttributeTypeModel)
    attribute = get_or_create_model(model_class=AttributeModel)

    yield attribute.pk

    delete_ext_attributes(attribute_pk=attribute.pk)
    delete_model(model_class=AttributeModel, pk=attribute.pk)
    delete_model(model_class=AttributeTypeModel, pk=attribute_type.pk)


def test_attribute_create(clear_attribute):
    attribute_pk, type_pk = clear_attribute
    attribute_dict = default_dicts[AttributeModel]
    attribute_dict["id"] = attribute_pk

    with pytest.raises(ModelNotFoundException):
        _ = AttributeModel.get(pk=attribute_pk)

    attribute = AttributeModel.parse_obj(attribute_dict)
    attribute.create()

    stored_attribute = AttributeModel.get(pk=attribute_pk)

    TestCase().assertDictEqual(stored_attribute.dict(), attribute.dict())


def test_attribute_update(create_attribute):
    attribute_pk = create_attribute
    attribute = AttributeModel.get(pk=attribute_pk)

    assert attribute.value != "unittest"

    attribute.value = "unittest"
    attribute.save()

    stored_attribute = AttributeModel.get(pk=attribute.pk)

    assert stored_attribute.pk == attribute.pk
    assert stored_attribute.value == "unittest"


def test_attribute_refresh(create_attribute):
    attribute_pk = create_attribute
    attribute = AttributeModel.get(pk=attribute_pk)

    modified_attribute = attribute.copy()
    modified_attribute.value = "unittest"
    modified_attribute.save()

    assert modified_attribute.value == "unittest"
    assert attribute.value != "unittest"

    attribute.refresh()

    assert attribute.value == "unittest"


def test_attribute_delete(create_attribute):
    attribute_pk = create_attribute
    attribute = AttributeModel.get(pk=attribute_pk)

    attribute.delete()

    with pytest.raises(ModelNotFoundException):
        _ = AttributeModel.get(pk=attribute_pk)


def test_attribute_ext_attributes(create_attribute):
    attribute_pk = create_attribute
    attribute = AttributeModel.get(pk=attribute_pk)

    attribute_dict = default_dicts[AttributeModel]
    attribute_dict["attribute_type_id"] = attribute.attribute_type_id
    attribute_dict["parent_attribute_id"] = attribute.pk

    old_ext_attributes = len(attribute.ext_attributes)

    ext_attribute = AttributeModel.parse_obj(attribute_dict)
    ext_attribute.id = None
    ext_attribute.create()

    assert len(attribute.ext_attributes) == old_ext_attributes + 1
