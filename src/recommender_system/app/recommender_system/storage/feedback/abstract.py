from abc import ABC, abstractmethod
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple

from sqlalchemy.orm.query import Query

from recommender_system.storage.abstract import AbstractStorage


class AbstractFeedbackStorage(AbstractStorage, ABC):
    """
    Base class for Feedback storage to define its functionality.

    """

    @abstractmethod
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

    @abstractmethod
    def get_session_sequences_query(
        self, session_ids: Optional[List[str]] = None
    ) -> Query:
        """
        Find sequence of visited product variant skus for every session and return SQL Query.

        Parameters
        ----------
        session_ids: Optional[List[str]]
            What session_id values to consider if not None, else all are considered.

        Returns
        -------
        Query
            Query of sequences of visited product variant skus for every session.

        """
        raise NotImplementedError()

    @abstractmethod
    def count_future_hit(
        self, date_from: datetime, date_to: datetime
    ) -> Dict[str, Any]:
        raise NotImplementedError()

    @abstractmethod
    def count_direct_hit(
        self, date_from: datetime, date_to: datetime, k: int
    ) -> Dict[str, Any]:
        raise NotImplementedError()

    @abstractmethod
    def count_coverage(
        self, date_from: datetime, date_to: datetime, per_model: bool, per_type: bool
    ) -> List[Tuple[Any, ...]]:
        raise NotImplementedError()
