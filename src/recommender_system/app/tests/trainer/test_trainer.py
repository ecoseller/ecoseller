from datetime import datetime

import pytest
from dependency_injector.wiring import inject, Provide

from recommender_system.managers.trainer import Trainer
from recommender_system.models.prediction.gpmf.model import GPMFPredictionModel
from recommender_system.models.prediction.similarity.model import (
    SimilarityPredictionModel,
)
from recommender_system.models.stored.feedback.review import ReviewModel
from recommender_system.models.stored.model.latest_identifier import (
    LatestIdentifierModel,
)
from recommender_system.models.stored.model.trainer_queue_item import (
    TrainerQueueItemModel,
)
from tests.storage.tools import delete_model


@pytest.fixture
def prepare_gpmf_data():
    user_ids = [1, 2, 3]
    variant_skus = ["1", "2", "3"]
    reviews = [
        ReviewModel(
            id=i,
            session_id=str(user_ids[i]),
            user_id=user_ids[i],
            product_id=int(variant_skus[i]),
            product_variant_sku=variant_skus[i],
            rating=i,
            update_at=datetime.now(),
            create_at=datetime.now(),
        )
        for i in range(3)
    ]

    for review in reviews:
        delete_model(model_class=ReviewModel, pk=review.pk)
        review.create()

    yield

    for review in reviews:
        delete_model(model_class=ReviewModel, pk=review.pk)


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


@inject
def test_trainer_gpmf(prepare_gpmf_data, trainer: Trainer = Provide["trainer"]):
    _ = prepare_gpmf_data

    try:
        latest_identifier = GPMFPredictionModel.get_latest_identifier()
    except LatestIdentifierModel.DoesNotExist:
        latest_identifier = None

    for item in TrainerQueueItemModel.gets(processed=False):
        item.set_processed()  # clears queue

    trainer.schedule_train(model_name=GPMFPredictionModel.Meta.model_name)
    trainer.train()

    assert GPMFPredictionModel.get_latest_identifier() != latest_identifier
