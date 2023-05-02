import itertools
from typing import Tuple

import numpy as np
from scipy.spatial.distance import pdist, squareform


def prepare_variants() -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    """
    Prepares product variants so their distances can be computed by similarity prediction model.

    Returns
    -------
    Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]
        Product variants in categorical attribute space.
        Product variants in numerical attribute space.
        Mask representing valid categorical attribute values.
        Mask representing valid numerical attribute values.
    """
    raise NotImplementedError()


def compute_weight(u: np.ndarray, v: np.ndarray) -> np.float:
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
    np.float
        The weight of distance of two product variants based on their attribute masks.
    """
    return np.sum(np.logical_or(u, v)) / np.sum(np.logical_and(u, v))


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
    raise NotImplementedError()
