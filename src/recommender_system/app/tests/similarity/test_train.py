import csv

import numpy as np
import pytest


from recommender_system.models.prediction.similarity.tools import (
    prepare_variants,
    compute_numerical_distances,
)
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


FILENAME = "tests/similarity/data_numerical.csv"
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
            raw_value = row[3]
            attributes.add((int(row[2]), raw_value))
            delete_model(
                model_class=AttributeModel,
                attribute_type_id=int(row[2]),
                raw_value=raw_value,
            )
    for price in ProductPriceModel.gets(price_list_code="RETAILROCKET"):
        price.delete()

    yield attributes

    for attribute_type_id, raw_value in attributes:
        delete_model(
            model_class=AttributeModel,
            attribute_type_id=attribute_type_id,
            raw_value=raw_value,
        )
    for price in ProductPriceModel.gets(price_list_code="RETAILROCKET"):
        price.delete()


def test_numerical_distances(
    clear_attribute_types,
    clear_product_types,
    clear_products,
    clear_product_variants,
    clear_attributes,
):
    _ = clear_attribute_types
    _ = clear_product_types
    _ = clear_products
    _ = clear_product_variants
    _ = clear_attributes

    fill_attribute_types(rows=ROWS)
    fill_product_types(rows=ROWS)
    fill_products(rows=ROWS)
    fill_attributes(rows=ROWS)

    train_data = prepare_variants()

    assert train_data.categorical is None
    assert train_data.categorical_mask is None
    assert train_data.numerical.shape == (4, 4)
    assert train_data.numerical_mask.shape == (4, 4)

    distances = compute_numerical_distances(
        variants=train_data.numerical, mask=train_data.numerical_mask
    )

    idx1 = train_data.product_variant_skus.index("1")
    idx2 = train_data.product_variant_skus.index("2")
    idx3 = train_data.product_variant_skus.index("3")
    idx4 = train_data.product_variant_skus.index("4")

    assert distances[idx1, idx2] == distances[idx1, idx3]
    assert distances[idx1, idx2] < distances[idx1, idx4]

    assert np.sum(train_data.numerical_mask[idx1]) == 3
    assert np.sum(train_data.numerical_mask[idx2]) == 3
    assert np.sum(train_data.numerical_mask[idx3]) == 3
    assert np.sum(train_data.numerical_mask[idx4]) == 3
