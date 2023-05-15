from abc import ABC, abstractmethod
from typing import Any, List, Optional

from recommender_system.storage.abstract import AbstractStorage


class AbstractSimilarityStorage(AbstractStorage, ABC):
    """
    Base class for Similarity storage to define its functionality.

    """

    @abstractmethod
    def get_closest_product_variant_skus(
        self, to: str, limit: Optional[int] = None, **kwargs: Any
    ) -> List[str]:
        """
        Selects product variants SKUs closest to the given product variant.

        The distances of pairs of product variants are saved in the storage.

        Parameters
        ----------
        to : str
            SKU of product variant for which to find the closest product variants.
        limit : str
            Maximum number of product variants to return. Returns all if `None`.
        kwargs : Any
            Additional filters to be applied to the query.

        Returns
        -------
        List[str]
            Selects product variants SKUs closest to the given product variant.

        """
        raise NotImplementedError()
