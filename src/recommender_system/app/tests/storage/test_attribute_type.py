from unittest import TestCase

import pytest

from recommender_system.models.stored.attribute import AttributeModel
from recommender_system.models.stored.attribute_type import AttributeTypeModel
from recommender_system.storage import ModelNotFoundException
from tests.storage.tools import create_model, delete_model


@pytest.fixture
def clear_attribute_type() -> int:
    attribute_type_id = 0
    attribute_type = create_model(model_class=AttributeTypeModel)

    delete_model(model_class=AttributeTypeModel, pk=attribute_type_id)

    yield attribute_type_id

    delete_model(model_class=AttributeTypeModel, pk=attribute_type.pk)


@pytest.fixture
def create_attribute_type() -> int:
    attribute_type = create_model(model_class=AttributeTypeModel)

    yield attribute_type.pk

    delete_model(model_class=AttributeTypeModel, pk=attribute_type.pk)


def test_attribute_type_create(clear_attribute_type) -> None:
    attribute_type_id = clear_attribute_type
    attribute_type_dict = {
        "id": attribute_type_id,
        "type_name": "weight",
        "unit": "kg",
    }

    with pytest.raises(ModelNotFoundException):
        _ = AttributeTypeModel.get(pk=attribute_type_id)

    attribute_type = AttributeTypeModel.parse_obj(attribute_type_dict)
    attribute_type.create()

    stored_attribute_type = AttributeTypeModel.get(pk=attribute_type_id)

    TestCase().assertDictEqual(stored_attribute_type.dict(), attribute_type.dict())


def test_attribute_type_update(create_attribute_type):
    attribute_id = create_attribute_type
    attribute_type = AttributeTypeModel.get(pk=attribute_id)

    assert attribute_type.type_name != "unittest"

    attribute_type.type_name = "unittest"
    attribute_type.save()

    stored_attribute_type = AttributeTypeModel.get(pk=attribute_type.id)

    assert stored_attribute_type.pk == attribute_type.pk
    assert stored_attribute_type.type_name == "unittest"


def test_attribute_type_refresh(create_attribute_type):
    attribute_type_id = create_attribute_type
    attribute_type = AttributeTypeModel.get(pk=attribute_type_id)

    modified_attribute = attribute_type.copy()
    modified_attribute.type_name = "unittest"
    modified_attribute.save()

    assert modified_attribute.type_name == "unittest"
    assert attribute_type.type_name != "unittest"

    attribute_type.refresh()

    assert attribute_type.type_name == "unittest"


def test_attribute_type_delete(create_attribute_type):
    attribute_type_id = create_attribute_type
    attribute_type = AttributeTypeModel.get(pk=attribute_type_id)

    attribute_type.delete()

    with pytest.raises(ModelNotFoundException):
        _ = AttributeTypeModel.get(pk=attribute_type_id)


def test_attribute_type_attributes(create_attribute_type):
    attribute_type_id = create_attribute_type
    attribute_type = AttributeTypeModel.get(pk=attribute_type_id)

    attribute_dict = {
        "id": 0,
        "value": "1",
        "attribute_type_id": attribute_type_id,
        "parent_attribute_id": None,
    }

    old_attributes = len(attribute_type.attributes)

    attribute = AttributeModel.parse_obj(attribute_dict)
    attribute.id = None
    attribute.create()

    assert len(attribute_type.attributes) == old_attributes + 1


def test_attribute_type_product_types():
    pass
