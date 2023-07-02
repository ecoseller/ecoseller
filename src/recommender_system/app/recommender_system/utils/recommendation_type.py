from typing import List

from enum import Enum


class RecommendationType(Enum):
    HOMEPAGE = "HOMEPAGE"
    CATEGORY_LIST = "CATEGORY_LIST"
    PRODUCT_DETAIL = "PRODUCT_DETAIL"
    CART = "CART"

    @classmethod
    def values(cls) -> List[str]:
        return [e.value for e in cls]
