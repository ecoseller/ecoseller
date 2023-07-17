from typing import Dict, List

from enum import Enum


_mapping: Dict[str, str] = {
    "HOMEPAGE": "Homepage",
    "CATEGORY_LIST": "Category list",
    "PRODUCT_DETAIL": "Product detail",
    "CART": "Cart",
}


class RecommendationType(Enum):
    HOMEPAGE = "HOMEPAGE"
    CATEGORY_LIST = "CATEGORY_LIST"
    PRODUCT_DETAIL = "PRODUCT_DETAIL"
    CART = "CART"

    @classmethod
    def values(cls) -> List[str]:
        return [e.value for e in cls]

    @classmethod
    def get_title(cls, value: str) -> str:
        return _mapping.get(value, value)
