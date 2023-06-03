from abc import ABC
from typing import List

from recommender_system.storage.abstract import AbstractStorage


class AbstractFeedbackStorage(AbstractStorage, ABC):
    """
    Base class for Feedback storage to define its functionality.

    """

    def get_session_sequences(self) -> List[List[str]]:
        """
        Find sequence of visited product variant skus for every session.

        Returns
        -------
        List[List[str]]
            Sequences of visited product variant skus for every session.

        """
        raise NotImplementedError()
