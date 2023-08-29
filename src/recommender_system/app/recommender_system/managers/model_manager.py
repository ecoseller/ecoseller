import logging
from typing import Any, List, Optional, Type, TYPE_CHECKING, Dict

from dependency_injector.wiring import inject, Provide

from recommender_system.managers.trainer import Trainer
from recommender_system.models.prediction.abstract import AbstractPredictionModel
from recommender_system.models.prediction.mapper import PredictionModelMapper
from recommender_system.utils.recommendation_type import RecommendationType

if TYPE_CHECKING:
    from recommender_system.managers.prediction_pipeline import PredictionPipeline
    from recommender_system.models.stored.model.config import ConfigModel


class ModelManager:
    @property
    def config(self) -> "ConfigModel":
        from recommender_system.models.stored.model.config import ConfigModel

        return ConfigModel.get_current()

    def get_model_from_cascade(
        self,
        recommendation_type: RecommendationType,
        cascade: List[str],
        session_id: str,
        user_id: Optional[int],
        **kwargs: Any,
    ) -> AbstractPredictionModel:
        from recommender_system.models.prediction.dummy.model import (
            DummyPredictionModel,
        )

        for model_name in cascade:
            model_class = PredictionModelMapper.map(model_name=model_name)
            if not self.config.is_disabled(model=model_name) and model_class.is_ready(
                recommendation_type=recommendation_type,
                session_id=session_id,
                user_id=user_id,
                **kwargs,
            ):
                return model_class(identifier=model_class.get_latest_identifier())

        return DummyPredictionModel()

    def get_model(
        self,
        recommendation_type: RecommendationType,
        step: "PredictionPipeline.Step",
        session_id: str,
        user_id: Optional[int],
        **kwargs: Any,
    ) -> AbstractPredictionModel:
        from recommender_system.models.prediction.selection.model import (
            SelectionPredictionModel,
        )

        attribute_name = (
            f"{recommendation_type.value.lower()}_{step.value.lower()}_cascade"
        )
        try:
            cascade = getattr(self.config, attribute_name)
        except Exception as e:
            logging.warning(
                f"Unable to obtain cascade for {recommendation_type} and {step}: {e}"
            )
            return SelectionPredictionModel()

        return self.get_model_from_cascade(
            recommendation_type=recommendation_type,
            cascade=cascade,
            session_id=session_id,
            user_id=user_id,
            **kwargs,
        )

    def create_model(self, model_name: str) -> AbstractPredictionModel:
        model_class = PredictionModelMapper.map(model_name)
        return model_class()

    @inject
    def products_modified(self, trainer: Trainer = Provide["trainer"]) -> None:
        from recommender_system.models.prediction.similarity.model import (
            SimilarityPredictionModel,
        )

        trainer.schedule_train(model_name=SimilarityPredictionModel.Meta.model_name)

    def get_all_models_dicts(self, include_dummy: bool = False) -> List[Dict[str, str]]:
        return [
            model.to_config()
            for model in self.get_all_models(include_dummy=include_dummy)
        ]

    def get_all_models(
        self, include_dummy: bool = False
    ) -> List[Type[AbstractPredictionModel]]:
        from recommender_system.models.prediction.selection.model import (
            SelectionPredictionModel,
        )
        from recommender_system.models.prediction.popularity.model import (
            PopularityPredictionModel,
        )
        from recommender_system.models.prediction.similarity.model import (
            SimilarityPredictionModel,
        )
        from recommender_system.models.prediction.gru4rec.model import (
            GRU4RecPredictionModel,
        )
        from recommender_system.models.prediction.ease.model import EASEPredictionModel
        from recommender_system.models.prediction.dummy.model import (
            DummyPredictionModel,
        )

        dummy: List[Type[AbstractPredictionModel]] = (
            [] if not include_dummy else [DummyPredictionModel]
        )

        return dummy + [
            SelectionPredictionModel,
            PopularityPredictionModel,
            SimilarityPredictionModel,
            GRU4RecPredictionModel,
            EASEPredictionModel,
        ]

    def get_all_model_names(self) -> List[str]:
        return [model.Meta.model_name for model in self.get_all_models()]
