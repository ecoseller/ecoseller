from datetime import datetime
from unittest import TestCase

import pytest

from recommender_system.models.stored.feedback.product_detail_enter import (
    ProductDetailEnterModel,
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
def create_product_detail_enter():
    product_detail_enter = get_or_create_model(model_class=ProductDetailEnterModel)

    yield product_detail_enter.pk

    delete_model(model_class=ProductDetailEnterModel, pk=product_detail_enter.pk)


def test_product_detail_enter_create(clear_session):
    session_pk = clear_session
    product_detail_enter_dict = default_dicts[ProductDetailEnterModel]

    with pytest.raises(SessionModel.DoesNotExist):
        _ = SessionModel.get(pk=session_pk)

    product_detail_enter = ProductDetailEnterModel.parse_obj(product_detail_enter_dict)
    product_detail_enter.create()
    assert product_detail_enter.pk is not None

    stored_product_detail_enter = ProductDetailEnterModel.get(
        pk=product_detail_enter.pk
    )
    session = SessionModel.get(pk=session_pk)

    TestCase().assertDictEqual(
        stored_product_detail_enter.dict(), product_detail_enter.dict()
    )

    assert product_detail_enter.session.pk == session.pk
    assert product_detail_enter.session.user_id == session.user_id


def test_product_detail_enter_update(create_product_detail_enter):
    product_detail_enter_pk = create_product_detail_enter
    product_detail_enter = ProductDetailEnterModel.get(pk=product_detail_enter_pk)

    product_detail_enter.create_at = datetime.now()
    with pytest.raises(TypeError):
        product_detail_enter.save()


def test_product_detail_enter_refresh(create_product_detail_enter):
    product_detail_enter_pk = create_product_detail_enter
    product_detail_enter = ProductDetailEnterModel.get(pk=product_detail_enter_pk)

    with pytest.raises(TypeError):
        product_detail_enter.refresh()


def test_product_detail_enter_delete(create_product_detail_enter):
    product_detail_enter_pk = create_product_detail_enter
    product_detail_enter = ProductDetailEnterModel.get(pk=product_detail_enter_pk)

    with pytest.raises(TypeError):
        product_detail_enter.delete()
