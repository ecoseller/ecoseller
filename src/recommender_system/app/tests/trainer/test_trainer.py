from datetime import datetime

import pytest
from dependency_injector.wiring import inject, Provide

from recommender_system.managers.trainer import Trainer
from recommender_system.models.prediction.ease.model import EASEPredictionModel
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
from recommender_system.models.stored.product.product_variant import ProductVariantModel
from tests.storage.tools import delete_model


@pytest.fixture
def prepare_ease_data():
    user_ids = [1, 2, 3]
    variants = [
        ProductVariantModel(
            sku=str(i),
            ean=str(i),
            stock_quantity=1,
            recommendation_weight=1,
            update_at=datetime.now(),
            create_at=datetime.now(),
        )
        for i in range(1, 4)
    ]
    reviews = [
        ReviewModel(
            id=i,
            session_id=str(user_ids[i]),
            user_id=user_ids[i],
            product_id=int(variants[i].sku),
            product_variant_sku=variants[i].sku,
            rating=i,
            update_at=datetime.now(),
            create_at=datetime.now(),
        )
        for i in range(3)
    ]

    for variant in variants:
        delete_model(model_class=ProductVariantModel, pk=variant.pk)
        variant.create()

    for review in reviews:
        delete_model(model_class=ReviewModel, pk=review.pk)
        review.create()

    yield

    for review in reviews:
        delete_model(model_class=ReviewModel, pk=review.pk)

    for variant in variants:
        delete_model(model_class=ProductVariantModel, pk=variant.pk)

    identifier = EASEPredictionModel.get_latest_identifier()
    LatestIdentifierModel.get(model_name=EASEPredictionModel.Meta.model_name).delete()
    EASEPredictionModel(identifier=identifier).delete()


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
def test_trainer_ease(prepare_ease_data, trainer: Trainer = Provide["trainer"]):
    _ = prepare_ease_data

    try:
        latest_identifier = EASEPredictionModel.get_latest_identifier()
    except LatestIdentifierModel.DoesNotExist:
        latest_identifier = None

    for item in TrainerQueueItemModel.gets(processed=False):
        item.set_processed()  # clears queue

    trainer.schedule_train(model_name=EASEPredictionModel.Meta.model_name)
    trainer.train()

    assert EASEPredictionModel.get_latest_identifier() != latest_identifier
