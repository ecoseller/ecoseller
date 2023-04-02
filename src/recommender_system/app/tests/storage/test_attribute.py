from unittest import TestCase

import pytest

from recommender_system.models.stored.attribute import AttributeModel
from recommender_system.models.stored.attribute_type import AttributeTypeModel
from recommender_system.storage import ModelNotFoundException
from tests.storage.tools import create_model, delete_model


@pytest.fixture
def clear_attribute() -> int:
    attribute_id = 0
    attribute_type = create_model(model_class=AttributeTypeModel)

    delete_model(model_class=AttributeModel, pk=attribute_id)

    yield attribute_id, attribute_type.pk

    delete_model(model_class=AttributeModel, pk=attribute_id)
    delete_model(model_class=AttributeTypeModel, pk=attribute_type.pk)


@pytest.fixture
def create_attribute() -> int:
    attribute_type = create_model(model_class=AttributeTypeModel)
    attribute = create_model(model_class=AttributeModel)

    yield attribute.pk

    delete_model(model_class=AttributeModel, pk=attribute.pk)
    delete_model(model_class=AttributeTypeModel, pk=attribute_type.pk)


def test_attribute_create(clear_attribute) -> None:
    attribute_id, type_id = clear_attribute
    attribute_dict = {
        "id": attribute_id,
        "value": "1",
        "attribute_type_id": type_id,
        "parent_attribute_id": None,
    }

    with pytest.raises(ModelNotFoundException):
        _ = AttributeModel.get(pk=attribute_id)

    attribute = AttributeModel.parse_obj(attribute_dict)
    attribute.create()

    stored_attribute = AttributeModel.get(pk=attribute_id)

    TestCase().assertDictEqual(stored_attribute.dict(), attribute.dict())


def test_attribute_update(create_attribute):
    attribute_id = create_attribute
    attribute = AttributeModel.get(pk=attribute_id)

    assert attribute.value != "unittest"

    attribute.value = "unittest"
    attribute.save()

    stored_attribute = AttributeModel.get(pk=attribute.id)

    assert stored_attribute.pk == attribute.pk
    assert stored_attribute.value == "unittest"


def test_attribute_refresh(create_attribute):
    attribute_id = create_attribute
    attribute = AttributeModel.get(pk=attribute_id)

    modified_attribute = attribute.copy()
    modified_attribute.value = "unittest"
    modified_attribute.save()

    assert modified_attribute.value == "unittest"
    assert attribute.value != "unittest"

    attribute.refresh()

    assert attribute.value == "unittest"


def test_attribute_delete(create_attribute):
    attribute_id = create_attribute
    attribute = AttributeModel.get(pk=attribute_id)

    attribute.delete()

    with pytest.raises(ModelNotFoundException):
        _ = AttributeModel.get(pk=attribute_id)
