from typing import List, NamedTuple, Optional

import numpy as np


class TrainData(NamedTuple):
    product_variant_skus: List[str]
    categorical: Optional[np.ndarray]
    numerical: np.ndarray
    categorical_mask: Optional[np.ndarray]
    numerical_mask: np.ndarray
