from datetime import datetime
from unittest import TestCase

import pytest

from recommender_system.models.stored.feedback.review import (
    ReviewModel,
)
from recommender_system.models.stored.feedback.session import SessionModel
from tests.storage.tools import get_or_create_model, delete_model, default_dicts


@pytest.fixture
def clear_review():
    review_dict = default_dicts[ReviewModel]
    session_pk = review_dict["session_id"]

    delete_model(model_class=ReviewModel, pk=review_dict["id"])
    delete_model(model_class=SessionModel, pk=session_pk)

    yield review_dict

    delete_model(model_class=SessionModel, pk=session_pk)
    delete_model(model_class=ReviewModel, pk=review_dict["id"])


@pytest.fixture
def create_review():
    review = get_or_create_model(model_class=ReviewModel)

    yield review.pk

    delete_model(model_class=ReviewModel, pk=review.pk)


def test_review_create(clear_review):
    review_dict = clear_review

    with pytest.raises(SessionModel.DoesNotExist):
        _ = SessionModel.get(pk=review_dict["session_id"])

    review = ReviewModel.parse_obj(review_dict)
    review.create()
    assert review.pk is not None

    stored_review = ReviewModel.get(pk=review.pk)
    session = SessionModel.get(pk=review.session_id)

    TestCase().assertDictEqual(stored_review.dict(), review.dict())

    assert review.session.pk == session.pk
    assert review.session.user_id == session.user_id


def test_review_update(create_review):
    review_pk = create_review
    review = ReviewModel.get(pk=review_pk)

    review.create_at = datetime.now()
    with pytest.raises(TypeError):
        review.save()


def test_review_refresh(create_review):
    review_pk = create_review
    review = ReviewModel.get(pk=review_pk)

    with pytest.raises(TypeError):
        review.refresh()


def test_review_delete(create_review):
    review_pk = create_review
    review = ReviewModel.get(pk=review_pk)

    with pytest.raises(TypeError):
        review.delete()
