from abc import ABC
from typing import List, Optional

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
