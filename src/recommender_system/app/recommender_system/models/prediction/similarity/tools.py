import itertools

from dependency_injector.wiring import inject, Provide
import numpy as np
from scipy.spatial.distance import pdist, squareform

from recommender_system.models.prediction.similarity.train_data import TrainData
from recommender_system.models.stored.attribute_type import AttributeTypeModel
from recommender_system.models.stored.product_variant import ProductVariantModel
from recommender_system.storage.abstract import AbstractStorage


DEFAULT_NUMERIC_VALUE = 0.5
DEFAULT_CATEGORICAL_VALUE = 0.5


@inject
def prepare_variants(
    product_storage: AbstractStorage = Provide["product_storage"],
) -> TrainData:
    """
    Prepares product variants so their distances can be computed by similarity prediction model.

    Returns
    -------
    TrainData
        Object containing all data needed for training og similarity prediction model.
    """
    product_variant_skus = product_storage.get_objects_attribute(
        model_class=ProductVariantModel, attribute=ProductVariantModel.Meta.primary_key
    )
    variant_mapper = {}
    for i, sku in enumerate(product_variant_skus):
        variant_mapper[sku] = i

    categorical_type_ids = product_storage.get_objects_attribute(
        model_class=AttributeTypeModel,
        attribute=AttributeTypeModel.Meta.primary_key,
        type=AttributeTypeModel.Type.CATEGORICAL,
    )
    categorical = None
    categorical_mask = None
    if len(categorical_type_ids) > 0:
        categorical = np.full(
            (len(product_variant_skus), len(categorical_type_ids)),
            DEFAULT_CATEGORICAL_VALUE,
            dtype=np.int64,
        )
        categorical_mask = np.full(
            (len(product_variant_skus), len(categorical_type_ids)), False, dtype=bool
        )
        for col, type_id in enumerate(categorical_type_ids):
            possible_values = product_storage.get_raw_attribute_values(
                attribute_type_id=type_id
            )
            value_mapper = {}
            for i, value in enumerate(possible_values):
                value_mapper[value] = i
            variant_attributes = product_storage.get_product_variant_attribute_values(
                attribute_type_id=type_id,
                attribute_type_type=AttributeTypeModel.Type.CATEGORICAL,
            )
            for sku, value in variant_attributes.items():
                row = variant_mapper[sku]
                if value is not None:
                    categorical[row, col] = value_mapper[value]
                    categorical_mask[row, col] = True

    prices = np.full(
        (len(product_variant_skus), 1), DEFAULT_NUMERIC_VALUE, dtype=np.double
    )
    prices_mask = np.full((len(product_variant_skus), 1), False, dtype=bool)
    prices_data = product_storage.get_product_variant_prices(pks=product_variant_skus)
    stats = product_storage.get_price_stats(pks=product_variant_skus)
    for sku, price in prices_data:
        if stats is not None:
            min, avg, max = stats
            if min != max:
                # Normalize into [0, 1]
                normalized_price = (price - min) / (max - min)
            else:
                normalized_price = DEFAULT_NUMERIC_VALUE
            row = variant_mapper[sku]
            prices[row, 0] = normalized_price
            prices_mask[row, 0] = True

    numerical_type_ids = product_storage.get_objects_attribute(
        model_class=AttributeTypeModel,
        attribute=AttributeTypeModel.Meta.primary_key,
        type=AttributeTypeModel.Type.NUMERICAL,
    )
    numerical = prices
    numerical_mask = prices_mask
    if len(numerical_type_ids) > 0:
        numerical = np.hstack(
            (
                prices,
                np.full(
                    (len(product_variant_skus), len(numerical_type_ids)),
                    DEFAULT_NUMERIC_VALUE,
                    dtype=np.double,
                ),
            )
        )
        numerical_mask = np.hstack(
            (
                prices_mask,
                np.full(
                    (len(product_variant_skus), len(numerical_type_ids)),
                    False,
                    dtype=bool,
                ),
            )
        )
        for col, type_id in enumerate(numerical_type_ids, start=1):
            stats = product_storage.get_attribute_type_stats(attribute_type_id=type_id)
            if stats is not None:
                min, avg, max = stats
                variant_attributes = (
                    product_storage.get_product_variant_attribute_values(
                        attribute_type_id=type_id,
                        attribute_type_type=AttributeTypeModel.Type.NUMERICAL,
                    )
                )
                for sku, value in variant_attributes.items():
                    row = variant_mapper[sku]
                    numerical_mask[row, col] = True
                    if min != max:
                        # Normalize into [0, 1]
                        normalized_value = (value - min) / (max - min)
                    else:
                        normalized_value = DEFAULT_NUMERIC_VALUE
                    numerical[row, col] = normalized_value

    return TrainData(
        product_variant_skus=product_variant_skus,
        categorical=categorical,
        numerical=numerical,
        categorical_mask=categorical_mask,
        numerical_mask=numerical_mask,
    )


def compute_weight(u: np.ndarray, v: np.ndarray) -> np.double:
    """
    Computes weight of distance of product variants based on their attribute masks.

    It computes size of union divided by size of intersection.
    The reason is that if product variants have a lot of different attributes,
    they are less similar and so their distance should increase.

    Parameters
    ----------
    u : np.ndarray
        First attribute mask.
    v : np.ndarray
        Second attribute mask.

    Returns
    -------
    np.double
        The weight of distance of two product variants based on their attribute masks.
    """
    result = np.sum(np.logical_or(u, v))
    divisor = np.sum(np.logical_and(u, v))
    if divisor != 0:
        result /= divisor
    return result


def compute_numerical_distances(variants: np.ndarray, mask: np.ndarray) -> np.ndarray:
    """
    Computes matrix of distances of all pairs of `variants` in numerical attribute space.

    Parameters
    ----------
    variants : np.ndarray
        Product variant in numerical attribute space.
    mask : np.ndarray
        Mask representing valid values of attributes of each product variant.

    Returns
    -------
    np.ndarray
        Matrix of distances of all pairs of `variants`.
    """
    return squareform(pdist(variants)) * squareform(
        [compute_weight(u, v) for u, v in itertools.combinations(mask, 2)]
    )


def categorical_distance(u: np.ndarray, v: np.ndarray) -> np.double:
    """
    Computes distance of two product variants in categorical attribute space.

    It computes the distance as the number of attributes with different value
    divided by the number of all categorical attributes.

    Parameters
    ----------
    u : np.ndarray
        First product variant.
    v : np.ndarray
        Second categorical variant.

    Returns
    -------
    np.double
        Distance of `u` and `v` in categorical attribute space.
    """
    return np.sum(u != v) / u.ravel().shape[0]


def compute_categorical_distances(variants: np.ndarray, mask: np.ndarray) -> np.ndarray:
    """
    Computes matrix of distances of all pairs of `variants` in categorical attribute space.

    Parameters
    ----------
    variants : np.ndarray
        Product variant in numerical attribute space.
    mask : np.ndarray
        Mask representing valid values of attributes of each product variant.

    Returns
    -------
    np.ndarray
        Matrix of distances of all pairs of `variants`.
    """
    return squareform(
        [categorical_distance(u, v) for u, v in itertools.combinations(variants, 2)]
    ) * squareform([compute_weight(u, v) for u, v in itertools.combinations(mask, 2)])
