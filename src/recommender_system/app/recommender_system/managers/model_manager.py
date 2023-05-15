from typing import TYPE_CHECKING

from dependency_injector.wiring import inject, Provide

from recommender_system.managers.trainer import Trainer
from recommender_system.models.prediction.abstract import AbstractPredictionModel
from recommender_system.models.prediction.mapper import PredictionModelMapper
from recommender_system.utils.recommendation_type import RecommendationType

if TYPE_CHECKING:
    from recommender_system.managers.prediction_pipeline import PredictionPipeline


class ModelManager:
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
