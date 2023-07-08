from typing import List, Type, TYPE_CHECKING

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

    def get_model(
        self, recommendation_type: RecommendationType, step: "PredictionPipeline.Step"
    ) -> AbstractPredictionModel:
        from recommender_system.models.prediction.dummy.model import (
            DummyPredictionModel,
        )

        # TODO: get latest model identifier and pass it as argument to constructor
        return DummyPredictionModel()

    def create_model(self, model_name: str) -> AbstractPredictionModel:
        model_class = PredictionModelMapper.map(model_name)
        return model_class()

    @inject
    def products_modified(self, trainer: Trainer = Provide["trainer"]) -> None:
        from recommender_system.models.prediction.similarity.model import (
            SimilarityPredictionModel,
        )

        trainer.schedule_train(model_name=SimilarityPredictionModel.Meta.model_name)

    def get_all_models(self) -> List[Type[AbstractPredictionModel]]:
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

        return [
            SelectionPredictionModel,
            PopularityPredictionModel,
            SimilarityPredictionModel,
            GRU4RecPredictionModel,
            EASEPredictionModel,
        ]

    def get_all_model_names(self) -> List[str]:
        return [model.Meta.model_name for model in self.get_all_models()]
