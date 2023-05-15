from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional

from recommender_system.storage.abstract import AbstractStorage
from recommender_system.storage.product.statistics import NumericalStatistics


class AbstractProductStorage(AbstractStorage, ABC):
    """
    Base class for Product storage to define its functionality.

    """

    @abstractmethod
    def get_popular_product_variant_skus(
        self, limit: Optional[int] = None
    ) -> List[str]:
        """
        Selects randomly sampled product variants' SKUs weighted by their popularity.

        The product variant's popularity is defined by the number of its items ordered.

        Parameters
        ----------
        limit : Optional[int]
            Maximum number of items to return. Returns all if `None`.

        Returns
        -------
        List[str]
            Randomly sampled product variants' SKUs weighted by their popularity.

        """
        raise NotImplementedError()

    @abstractmethod
    def get_product_variant_popularities(self, skus: List[str]) -> Dict[str, int]:
        """
        Computes popularity of each product variant given by its SKU.

        The product variant's popularity is defined by the number of its items ordered.

        Parameters
        ----------
        skus : List[str]
            SKUs of product variants for which popularity should be computed.

        Returns
        -------
        Dict[str, int]
            Dictionary whose keys are product variant SKUs and values their popularities.

        """
        raise NotImplementedError()

    @abstractmethod
    def get_raw_attribute_values(self, attribute_type_id: int) -> List[str]:
        """
        Selects raw values of all attributes of given attribute type.

        Parameters
        ----------
        attribute_type_id : int
            ID of attribute type for which to select values.

        Returns
        -------
        List[str]
            Raw values of all attributes of given attribute type.

        """
        raise NotImplementedError()

    @abstractmethod
    def get_attribute_type_stats(
        self, attribute_type_id: int
    ) -> Optional[NumericalStatistics]:
        """
        Computes statistics of numerical values of given attribute type.

        Parameters
        ----------
        attribute_type_id : int
            ID of attribute type for which to compute statistics.

        Returns
        -------
        Optional[NumericalStatistics]
            Statistics of numerical values of given attribute type.

        """
        raise NotImplementedError()

    @abstractmethod
    def get_product_variant_attribute_values(
        self, attribute_type_id: int
    ) -> Dict[str, Optional[Any]]:
        """
        Selects value for given attribute type of all product variants that have this attribute type's value assigned.

        Selects `numerical_value` for numerical attribute type and `raw_value` for categorical attribute type.

        Parameters
        ----------
        attribute_type_id : int
            ID of attribute type for which to get values.

        Returns
        -------
        Dict[str, Optional[Any]]
            Dictionary whose keys are product variant SKUs, values are the given attribute type's values.

        """
        raise NotImplementedError()

    @abstractmethod
    def get_product_variant_skus_in_category(self, category_id: int) -> List[str]:
        """
        Selects product variants SKUs that are in the given category and all its children.

        Parameters
        ----------
        category_id : int
            ID of category where to find product variants.

        Returns
        -------
        List[str]
            Product variants SKUs that are in the given category and all its children.

        """
        raise NotImplementedError()

    @abstractmethod
    def get_product_variant_prices(
        self, product_variant_skus: List[str]
    ) -> Dict[str, float]:
        """
        Selects price of all given product variants.

        Parameters
        ----------
        product_variant_skus : List[str]
            SKUs of product variants for which to select price.

        Returns
        -------
        Dict[str, float]
            Dictionary whose keys are product variant SKUs, values are their prices.

        """
        raise NotImplementedError()

    @abstractmethod
    def get_price_stats(
        self, product_variant_skus: List[str]
    ) -> Optional[NumericalStatistics]:
        """
        Computes statistics of prices of product variants given by their SKUs.

        Parameters
        ----------
        product_variant_skus : List[str]
            SKUs of product variants for which to compute price statistics.

        Returns
        -------
        Optional[NumericalStatistics]
            Statistics of prices of product variants given by their SKUs.

        """
        raise NotImplementedError()

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
