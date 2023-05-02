from typing import List, NamedTuple

import numpy as np


class TrainData(NamedTuple):
    product_variant_skus: List[str]
    categorical: np.ndarray
    numerical: np.ndarray
    categorical_mask: np.ndarray
    numerical_mask: np.ndarray
