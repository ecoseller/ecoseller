from abc import ABC, abstractmethod
from typing import Any, List, Optional, Dict, TYPE_CHECKING

from dependency_injector.wiring import Provide, inject

from recommender_system.models.stored.model.latest_identifier import (
    LatestIdentifierModel,
)
from recommender_system.utils.recommendation_type import RecommendationType

if TYPE_CHECKING:
    from recommender_system.managers.model_manager import ModelManager


class AbstractPredictionModel(ABC):
    identifier: str

    class Meta:
        model_name: str
        title: str
        description: str

    def __init__(self, identifier: Optional[str] = None):
        self.identifier = identifier or self.default_identifier

    @property
    @abstractmethod
    def default_identifier(self) -> str:
        raise NotImplementedError()

    @classmethod
    @abstractmethod
    def is_ready(
        cls,
        recommendation_type: RecommendationType,
        session_id: str,
        user_id: Optional[int],
        **kwargs: Any
    ) -> bool:
        raise NotImplementedError()

    @classmethod
    @abstractmethod
    def can_be_trained(cls) -> bool:
        raise NotImplementedError()

    @classmethod
    @abstractmethod
    def is_ready_for_training(cls) -> bool:
        raise NotImplementedError()

    @abstractmethod
    def delete(self) -> None:
        raise NotImplementedError()

    @abstractmethod
    def retrieve_homepage(self, session_id: str, user_id: Optional[int]) -> List[str]:
        raise NotImplementedError()

    @abstractmethod
    def retrieve_product_detail(
        self, session_id: str, user_id: Optional[int], variant: str
    ) -> List[str]:
        raise NotImplementedError()

    @abstractmethod
    def retrieve_cart(
        self, session_id: str, user_id: Optional[int], variants_in_cart: List[str]
    ) -> List[str]:
        raise NotImplementedError()

    @abstractmethod
    def score_homepage(
        self, session_id: str, user_id: Optional[int], variants: List[str]
    ) -> List[str]:
        raise NotImplementedError()

    @abstractmethod
    def score_category_list(
        self, session_id: str, user_id: Optional[int], variants: List[str]
    ) -> List[str]:
        raise NotImplementedError()

    @abstractmethod
    def score_product_detail(
        self, session_id: str, user_id: Optional[int], variants: List[str], variant: str
    ) -> List[str]:
        raise NotImplementedError()

    @abstractmethod
    def score_cart(
        self,
        session_id: str,
        user_id: Optional[int],
        variants: List[str],
        variants_in_cart: List[str],
    ) -> List[str]:
        raise NotImplementedError()

    @abstractmethod
    def train(self) -> None:
        raise NotImplementedError()

    @classmethod
    def get_latest_identifier(cls) -> str:
        return LatestIdentifierModel.get(model_name=cls.Meta.model_name).identifier

    def replace_old(self) -> None:
        try:
            latest_identifier = self.get_latest_identifier()
        except LatestIdentifierModel.DoesNotExist:
            latest_identifier = None
        LatestIdentifierModel(
            model_name=self.Meta.model_name, identifier=self.identifier
        ).save()
        if latest_identifier is not None and latest_identifier != self.identifier:
            self.__class__(identifier=latest_identifier).delete()

    @classmethod
    @inject
    def to_config(
        cls, model_manager: "ModelManager" = Provide["model_manager"]
    ) -> Dict[str, Any]:
        try:
            _ = cls.get_latest_identifier()
            is_trained = True
        except LatestIdentifierModel.DoesNotExist:
            is_trained = False
        return {
            "name": cls.Meta.model_name,
            "title": cls.Meta.title,
            "description": cls.Meta.description,
            "disabled": model_manager.config.is_disabled(model=cls.Meta.model_name),
            "canBeTrained": cls.can_be_trained(),
            "isReadyForTraining": cls.is_ready_for_training(),
            "isTrained": is_trained,
        }
