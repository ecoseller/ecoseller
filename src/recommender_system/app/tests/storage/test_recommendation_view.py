from datetime import datetime
from unittest import TestCase

import pytest

from recommender_system.models.stored.feedback.recommendation_view import (
    RecommendationViewModel,
)
from recommender_system.models.stored.feedback.session import SessionModel
from tests.storage.tools import get_or_create_model, delete_model, default_dicts


@pytest.fixture
def clear_session():
    session_pk = "session"

    delete_model(model_class=SessionModel, pk=session_pk)

    yield session_pk

    delete_model(model_class=SessionModel, pk=session_pk)


@pytest.fixture
def create_recommendation_view():
    recommendation_view = get_or_create_model(model_class=RecommendationViewModel)

    yield recommendation_view.pk

    delete_model(model_class=RecommendationViewModel, pk=recommendation_view.pk)


def test_recommendation_view_create(clear_session):
    session_pk = clear_session
    recommendation_view_dict = default_dicts[RecommendationViewModel]

    with pytest.raises(SessionModel.DoesNotExist):
        _ = SessionModel.get(pk=session_pk)

    recommendation_view = RecommendationViewModel.parse_obj(recommendation_view_dict)
    recommendation_view.create()
    assert recommendation_view.pk is not None

    stored_recommendation_view = RecommendationViewModel.get(pk=recommendation_view.pk)
    session = SessionModel.get(pk=session_pk)

    TestCase().assertDictEqual(
        stored_recommendation_view.dict(), recommendation_view.dict()
    )

    assert recommendation_view.session.pk == session.pk
    assert recommendation_view.session.user_id == session.user_id


def test_recommendation_view_update(create_recommendation_view):
    recommendation_view_pk = create_recommendation_view
    recommendation_view = RecommendationViewModel.get(pk=recommendation_view_pk)

    recommendation_view.create_at = datetime.now()
    with pytest.raises(TypeError):
        recommendation_view.save()


def test_recommendation_view_refresh(create_recommendation_view):
    recommendation_view_pk = create_recommendation_view
    recommendation_view = RecommendationViewModel.get(pk=recommendation_view_pk)

    with pytest.raises(TypeError):
        recommendation_view.refresh()


def test_recommendation_view_delete(create_recommendation_view):
    recommendation_view_pk = create_recommendation_view
    recommendation_view = RecommendationViewModel.get(pk=recommendation_view_pk)

    with pytest.raises(TypeError):
        recommendation_view.delete()
