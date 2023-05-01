import csv

import pytest

from recommender_system.models.stored.attribute import AttributeModel
from recommender_system.models.stored.attribute_type import AttributeTypeModel
from recommender_system.models.stored.product import ProductModel
from recommender_system.models.stored.product_price import ProductPriceModel
from recommender_system.models.stored.product_type import ProductTypeModel
from recommender_system.models.stored.product_variant import ProductVariantModel
from recommender_system.scripts.fill_data import (
    fill_attribute_types,
    fill_product_types,
    fill_products,
    fill_attributes,
)
from tests.storage.tools import delete_model


FILENAME = "tests/fill_data/properties.csv"
with open(FILENAME, "r") as file:
    ROWS = list(csv.reader(file, delimiter=","))[1:]


@pytest.fixture
def clear_attribute_types():
    attribute_type_ids = set()
    for row in ROWS:
        if row[2] not in ["available", "categoryid", "790"]:
            attribute_type_ids.add(int(row[2]))
            delete_model(model_class=AttributeTypeModel, pk=int(row[2]))

    yield attribute_type_ids

    for attribute_type_id in attribute_type_ids:
        delete_model(model_class=AttributeTypeModel, pk=attribute_type_id)


@pytest.fixture
def clear_product_types():
    product_type_ids = set()
    for row in ROWS:
        if row[2] == "categoryid":
            product_type_ids.add(int(row[3]))
            delete_model(model_class=ProductTypeModel, pk=int(row[3]))

    yield product_type_ids

    for product_type_id in product_type_ids:
        delete_model(model_class=ProductTypeModel, pk=product_type_id)


@pytest.fixture
def clear_products():
    product_ids = set()
    for row in ROWS:
        product_ids.add(int(row[1]))
        delete_model(model_class=ProductModel, pk=int(row[1]))

    yield product_ids

    for product_id in product_ids:
        delete_model(model_class=ProductModel, pk=product_id)


@pytest.fixture
def clear_product_variants():
    product_variant_skus = set()
    for row in ROWS:
        product_variant_skus.add(row[1])
        delete_model(model_class=ProductVariantModel, pk=row[1])

    yield product_variant_skus

    for product_variant_sku in product_variant_skus:
        delete_model(model_class=ProductVariantModel, pk=product_variant_sku)


@pytest.fixture
def clear_attributes():
    attributes = set()

    is_numerical = {}
    for row in ROWS:
        if row[2] not in ["available", "categoryid", "790"]:
            if row[2] not in is_numerical:
                is_numerical[row[2]] = True
            is_numerical[row[2]] = (
                is_numerical[row[2]] and " " not in row[3] and row[3].startswith("n")
            )

    for row in ROWS:
        if row[2] not in ["available", "categoryid", "790"]:
            value = row[3]
            if is_numerical[row[2]]:
                value = value[1:]
            attributes.add((int(row[2]), value))
            delete_model(
                model_class=AttributeModel, attribute_type_id=int(row[2]), value=value
            )
    for price in ProductPriceModel.gets(price_list_code="RETAILROCKET"):
        price.delete()

    yield attributes

    for attribute_type_id, value in attributes:
        delete_model(
            model_class=AttributeModel, attribute_type_id=attribute_type_id, value=value
        )
    for price in ProductPriceModel.gets(price_list_code="RETAILROCKET"):
        price.delete()


def test_fill_attribute_types(clear_attribute_types):
    attribute_type_ids = clear_attribute_types

    for attribute_type_id in attribute_type_ids:
        with pytest.raises(AttributeTypeModel.DoesNotExist):
            _ = AttributeTypeModel.get(pk=attribute_type_id)

    old_count = len(AttributeTypeModel.gets())

    fill_attribute_types(rows=ROWS)

    new_count = len(AttributeTypeModel.gets())

    assert new_count == old_count + len(attribute_type_ids)


def test_fill_product_types(clear_attribute_types, clear_product_types):
    _ = clear_attribute_types
    product_type_ids = clear_product_types

    for product_type_id in product_type_ids:
        with pytest.raises(ProductTypeModel.DoesNotExist):
            _ = ProductTypeModel.get(pk=product_type_id)

    old_count = len(ProductTypeModel.gets())

    fill_attribute_types(rows=ROWS)
    fill_product_types(rows=ROWS)

    new_count = len(ProductTypeModel.gets())

    assert new_count == old_count + len(product_type_ids)

    assert len(ProductTypeModel.get(pk=1).attribute_types) == 2
    assert len(ProductTypeModel.get(pk=2).attribute_types) == 1


def test_fill_products(clear_products, clear_product_variants):
    product_ids = clear_products
    product_variant_skus = clear_product_variants

    for product_id in product_ids:
        with pytest.raises(ProductModel.DoesNotExist):
            _ = ProductModel.get(pk=product_id)

    old_products_count = len(ProductModel.gets())
    old_product_variants_count = len(ProductVariantModel.gets())

    fill_products(rows=ROWS)

    new_products_count = len(ProductModel.gets())
    new_product_variants_count = len(ProductVariantModel.gets())

    assert new_products_count == old_products_count + len(product_ids)
    assert new_product_variants_count == old_product_variants_count + len(
        product_variant_skus
    )


def test_fill_attributes(
    clear_attribute_types, clear_products, clear_product_variants, clear_attributes
):
    _ = clear_attribute_types
    _ = clear_products
    _ = clear_product_variants
    attributes = clear_attributes

    for attribute_type_id, value in attributes:
        with pytest.raises(AttributeModel.DoesNotExist):
            _ = AttributeModel.get(attribute_type_id=attribute_type_id, value=value)

    old_count = len(AttributeModel.gets())

    fill_attribute_types(rows=ROWS)
    fill_products(rows=ROWS)
    fill_attributes(rows=ROWS)

    new_count = len(AttributeModel.gets())

    assert new_count == old_count + len(attributes)

    assert len(ProductVariantModel.get(pk="1").attributes) == 3
    assert len(ProductVariantModel.get(pk="2").attributes) == 2
    assert len(ProductVariantModel.get(pk="3").attributes) == 1

    assert ProductPriceModel.get(product_variant_sku="1").price == 360
    assert ProductPriceModel.get(product_variant_sku="2").price == 5360
    assert ProductPriceModel.get(product_variant_sku="3").price == 15360
