from datetime import datetime
from unittest import TestCase

import pytest

from recommender_system.models.stored.product.attribute import AttributeModel
from recommender_system.models.stored.product.attribute_product_variant import (
    AttributeProductVariantModel,
)
from recommender_system.models.stored.product.attribute_type import AttributeTypeModel
from recommender_system.models.stored.product.product_variant import ProductVariantModel
from tests.storage.tools import get_or_create_model, delete_model, default_dicts


def delete_ext_attributes(attribute_pk: int):
    for attribute in AttributeModel.gets(parent_attribute_id=attribute_pk):
        attribute.delete()


def delete_product_variants(attribute_pk: int):
    for apv in AttributeProductVariantModel.gets(attribute_id=attribute_pk):
        try:
            ProductVariantModel.get(pk=apv.product_variant_sku).delete()
        except ProductVariantModel.DoesNotExist:
            pass
        apv.delete()


@pytest.fixture
def clear_attribute():
    attribute_pk = 0
    attribute_type = get_or_create_model(model_class=AttributeTypeModel)

    delete_model(model_class=AttributeModel, pk=attribute_pk)

    yield attribute_pk, attribute_type.pk

    delete_model(model_class=AttributeModel, pk=attribute_pk)
    delete_model(model_class=AttributeTypeModel, pk=attribute_type.pk)


@pytest.fixture
def create_attribute():
    attribute_type = get_or_create_model(model_class=AttributeTypeModel)
    attribute = get_or_create_model(model_class=AttributeModel)

    yield attribute.pk

    delete_ext_attributes(attribute_pk=attribute.pk)
    delete_product_variants(attribute_pk=attribute.pk)
    delete_model(model_class=AttributeModel, pk=attribute.pk)
    delete_model(model_class=AttributeTypeModel, pk=attribute_type.pk)


def test_attribute_create(clear_attribute):
    attribute_pk, type_pk = clear_attribute
    attribute_dict = default_dicts[AttributeModel]
    attribute_dict["id"] = attribute_pk

    with pytest.raises(AttributeModel.DoesNotExist):
        _ = AttributeModel.get(pk=attribute_pk)

    attribute = AttributeModel.parse_obj(attribute_dict)
    attribute.create()

    stored_attribute = AttributeModel.get(pk=attribute_pk)

    TestCase().assertDictEqual(stored_attribute.dict(), attribute.dict())


def test_attribute_update(create_attribute):
    attribute_pk = create_attribute
    attribute = AttributeModel.get(pk=attribute_pk)

    assert attribute.raw_value != "unittest"

    attribute.raw_value = "unittest"
    attribute.save()

    stored_attribute = AttributeModel.get(pk=attribute.pk)

    assert stored_attribute.pk == attribute.pk
    assert stored_attribute.raw_value == "unittest"


def test_attribute_refresh(create_attribute):
    attribute_pk = create_attribute
    attribute = AttributeModel.get(pk=attribute_pk)

    modified_attribute = attribute.copy()
    modified_attribute.raw_value = "unittest"
    modified_attribute.save()

    assert modified_attribute.raw_value == "unittest"
    assert attribute.raw_value != "unittest"

    attribute.refresh()

    assert attribute.raw_value == "unittest"


def test_attribute_delete(create_attribute):
    attribute_pk = create_attribute
    attribute = AttributeModel.get(pk=attribute_pk)

    attribute.delete()

    with pytest.raises(AttributeModel.DoesNotExist):
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


def test_attribute_product_variants(create_attribute):
    attribute_pk = create_attribute
    attribute = AttributeModel.get(pk=attribute_pk)

    product_variant_dict = default_dicts[ProductVariantModel]

    old_product_variants = len(attribute.product_variants)

    product_variant = ProductVariantModel.parse_obj(product_variant_dict)
    product_variant.sku = datetime.now().isoformat()
    product_variant.create()

    attribute.add_product_variant(product_variant=product_variant)

    assert len(attribute.product_variants) == old_product_variants + 1
