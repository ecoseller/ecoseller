import csv

import numpy as np
import pytest


from recommender_system.models.prediction.similarity.model import (
    SimilarityPredictionModel,
)
from recommender_system.models.prediction.similarity.tools import (
    prepare_variants,
    compute_numerical_distances,
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


FILENAME = "tests/similarity/data_numerical.csv"
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


def test_train_numerical_distances(
    clear_database,
):
    _ = clear_database

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


def test_predict_numerical_distances(
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
