import csv

import numpy as np
import pytest


from recommender_system.models.prediction.similarity.model import (
    SimilarityPredictionModel,
)
from recommender_system.models.prediction.similarity.tools import (
    prepare_variants,
    compute_categorical_distances,
)
from recommender_system.models.stored.attribute import AttributeModel
from recommender_system.models.stored.attribute_type import AttributeTypeModel
from recommender_system.models.stored.product import ProductModel
from recommender_system.models.stored.product_type import ProductTypeModel
from recommender_system.models.stored.product_variant import ProductVariantModel
from recommender_system.scripts.fill_data import (
    fill_attribute_types,
    fill_product_types,
    fill_products,
    fill_attributes,
)


FILENAME = "tests/similarity/data_categorical.csv"
with open(FILENAME, "r") as file:
    ROWS = list(csv.reader(file, delimiter=","))[1:]


@pytest.fixture
def clear_database():
    for attribute_type in AttributeTypeModel.gets():
        attribute_type.delete()
    for product_type in ProductTypeModel.gets():
        product_type.delete()
    for product in ProductModel.gets():
        product.delete()
    for attribute_variant in ProductVariantModel.gets():
        attribute_variant.delete()
    for attribute in AttributeModel.gets():
        attribute.delete()

    yield

    for attribute_type in AttributeTypeModel.gets():
        attribute_type.delete()
    for product_type in ProductTypeModel.gets():
        product_type.delete()
    for product in ProductModel.gets():
        product.delete()
    for attribute_variant in ProductVariantModel.gets():
        attribute_variant.delete()
    for attribute in AttributeModel.gets():
        attribute.delete()


def test_train_categorical_distances(
    clear_database,
):
    _ = clear_database

    fill_attribute_types(rows=ROWS)
    fill_product_types(rows=ROWS)
    fill_products(rows=ROWS)
    fill_attributes(rows=ROWS)

    train_data = prepare_variants()

    assert train_data.categorical is not None
    assert train_data.categorical_mask is not None
    assert train_data.categorical.shape == (4, 3)
    assert train_data.categorical_mask.shape == (4, 3)

    distances = compute_categorical_distances(
        variants=train_data.categorical, mask=train_data.categorical_mask
    )

    idx1 = train_data.product_variant_skus.index("1")
    idx2 = train_data.product_variant_skus.index("2")
    idx3 = train_data.product_variant_skus.index("3")
    idx4 = train_data.product_variant_skus.index("4")

    assert distances[idx1, idx2] == distances[idx1, idx3]
    assert distances[idx1, idx2] < distances[idx1, idx4]

    assert np.sum(train_data.categorical_mask[idx1]) == 2
    assert np.sum(train_data.categorical_mask[idx2]) == 2
    assert np.sum(train_data.categorical_mask[idx3]) == 2
    assert np.sum(train_data.categorical_mask[idx4]) == 2


def test_predict_categorical_distances(
    clear_database,
):
    _ = clear_database

    fill_attribute_types(rows=ROWS)
    fill_product_types(rows=ROWS)
    fill_products(rows=ROWS)
    fill_attributes(rows=ROWS)

    model = SimilarityPredictionModel()
    model.train()

    result = model.retrieve_product_detail(
        session_id="session", user_id=None, variant="1"
    )

    assert "1" not in result
    assert result.index("2") < result.index("4")
