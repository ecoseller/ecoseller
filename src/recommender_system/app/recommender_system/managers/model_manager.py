from typing import TYPE_CHECKING

from recommender_system.models.prediction.abstract import AbstractPredictionModel
from recommender_system.models.prediction.dummy.model import DummyPredictionModel
from recommender_system.utils.recommendation_type import RecommendationType


if TYPE_CHECKING:
    from recommender_system.managers.prediction_pipeline import PredictionPipeline


class ModelManager:
    def get_model(
        self, recommendation_type: RecommendationType, step: "PredictionPipeline.Step"
    ) -> AbstractPredictionModel:
        return DummyPredictionModel()
