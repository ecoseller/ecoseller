from abc import ABC, abstractmethod
from datetime import datetime
from typing import Any, Dict, List, Optional

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
        self,
        session_ids: Optional[List[str]] = None,
        date_from: Optional[datetime] = None,
    ) -> Query:
        """
        Find sequence of visited product variant skus for every session and return SQL Query.

        Parameters
        ----------
        session_ids: Optional[List[str]]
            What session_id values to consider if not None, else all are considered.
        date_from: Optional[datetime]
            Consider only sessions created no sooner than this parameter.

        Returns
        -------
        Query
            Query of sequences of visited product variant skus for every session.

        """
        raise NotImplementedError()

    @abstractmethod
    def count_future_hit(
        self, date_from: datetime, date_to: datetime, k: int, model_name: Optional[str]
    ) -> Dict[str, Any]:
        raise NotImplementedError()

    @abstractmethod
    def count_direct_hit(
        self, date_from: datetime, date_to: datetime, k: int, model_name: Optional[str]
    ) -> Dict[str, Any]:
        raise NotImplementedError()

    @abstractmethod
    def count_coverage(
        self, date_from: datetime, date_to: datetime, model_name: Optional[str]
    ) -> int:
        raise NotImplementedError()

    @abstractmethod
    def count_predictions(
        self, date_from: datetime, date_to: datetime, model_name: Optional[str]
    ) -> int:
        raise NotImplementedError()

    @abstractmethod
    def get_retrieval_duration(
        self, date_from: datetime, date_to: datetime, model_name: Optional[str]
    ) -> Dict[str, Any]:
        raise NotImplementedError()

    @abstractmethod
    def get_scoring_duration(
        self, date_from: datetime, date_to: datetime, model_name: Optional[str]
    ) -> Dict[str, Any]:
        raise NotImplementedError()
