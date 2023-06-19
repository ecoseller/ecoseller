from typing import ClassVar, Dict, Type

from recommender_system.models.prediction.abstract import AbstractPredictionModel
from recommender_system.models.prediction.dummy.model import DummyPredictionModel
from recommender_system.models.prediction.ease.model import EASEPredictionModel
from recommender_system.models.prediction.gru4rec.model import GRU4RecPredictionModel
from recommender_system.models.prediction.popularity.model import (
    PopularityPredictionModel,
)
from recommender_system.models.prediction.selection.model import (
    SelectionPredictionModel,
)
from recommender_system.models.prediction.similarity.model import (
    SimilarityPredictionModel,
)


_prediction_models = [
    DummyPredictionModel,
    EASEPredictionModel,
    GRU4RecPredictionModel,
    PopularityPredictionModel,
    SelectionPredictionModel,
    SimilarityPredictionModel,
]


class PredictionModelMapper:
    mapping: ClassVar[Dict[str, Type[AbstractPredictionModel]]] = {
        prediction_model.Meta.model_name: prediction_model
        for prediction_model in _prediction_models
    }

    @classmethod
    def map(cls, model_name: str) -> Type[AbstractPredictionModel]:
        return cls.mapping[model_name]
