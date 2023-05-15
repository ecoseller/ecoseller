from dependency_injector.wiring import inject, Provide

from recommender_system.managers.trainer import Trainer
from recommender_system.models.prediction.similarity.model import (
    SimilarityPredictionModel,
)
from recommender_system.models.stored.model.latest_identifier import (
    LatestIdentifierModel,
)
from recommender_system.models.stored.model.trainer_queue_item import (
    TrainerQueueItemModel,
)


@inject
def test_trainer_similarity(trainer: Trainer = Provide["trainer"]):
    try:
        latest_identifier = SimilarityPredictionModel.get_latest_identifier()
    except LatestIdentifierModel.DoesNotExist:
        latest_identifier = None

    for item in TrainerQueueItemModel.gets(processed=False):
        item.set_processed()  # clears queue

    trainer.schedule_train(model_name=SimilarityPredictionModel.Meta.model_name)
    trainer.train()

    assert SimilarityPredictionModel.get_latest_identifier() != latest_identifier
