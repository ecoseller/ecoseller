from abc import ABC
from typing import Dict, List, Optional, Tuple

from recommender_system.storage.abstract import AbstractStorage


class AbstractFeedbackStorage(AbstractStorage, ABC):
    """
    Base class for Feedback storage to define its functionality.

    """

    def get_session_sequences(
        self, session_ids: Optional[List[str]] = None
    ) -> List[List[str]]:
        """
        Find sequence of visited product variant skus for every session.

        Parameters
        ----------
        session_ids: Optional[List[str]]
            What session_id values to consider if not None, else all are considered.

        Returns
        -------
        List[List[str]]
            Sequences of visited product variant skus for every session.

        """
        raise NotImplementedError()

    def get_product_variant_skus_with_rating(self) -> List[str]:
        """
        Finds product variant SKUs in the storage and returns all containing some rating.

        Returns
        -------
        List[str]
            SKUs of all the rated variants.

        """
        raise NotImplementedError()

    def get_user_ids_with_rating(self) -> List[int]:
        """
        Finds user IDs in the storage and returns all containing some rating.

        Returns
        -------
        List[int]
            IDs of all the users that rated some product variant.

        """
        raise NotImplementedError()

    def get_explicit_ratings(self) -> Dict[Tuple[int, str], int]:
        """
        Gets all explicit ratings of all users and all product variants.

        Returns
        -------
        Dict[Tuple[int, str], int]
            Dictionary containing rating for all found pairs of user and product variant in the database.

        """
        raise NotImplementedError()
