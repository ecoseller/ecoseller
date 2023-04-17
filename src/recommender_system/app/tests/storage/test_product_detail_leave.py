from datetime import datetime
from unittest import TestCase

import pytest

from recommender_system.models.stored.product_detail_leave import (
    ProductDetailLeaveModel,
)
from recommender_system.models.stored.session import SessionModel
from tests.storage.tools import get_or_create_model, delete_model, default_dicts


@pytest.fixture
def clear_session():
    session_pk = "session"

    delete_model(model_class=SessionModel, pk=session_pk)

    yield session_pk

    delete_model(model_class=SessionModel, pk=session_pk)


@pytest.fixture
def create_product_detail_leave():
    product_detail_leave = get_or_create_model(model_class=ProductDetailLeaveModel)

    yield product_detail_leave.pk

    delete_model(model_class=ProductDetailLeaveModel, pk=product_detail_leave.pk)


def test_product_detail_leave_create(clear_session):
    session_pk = clear_session
    product_detail_leave_dict = default_dicts[ProductDetailLeaveModel]

    with pytest.raises(SessionModel.DoesNotExist):
        _ = SessionModel.get(pk=session_pk)

    product_detail_leave = ProductDetailLeaveModel.parse_obj(product_detail_leave_dict)
    product_detail_leave.create()
    assert product_detail_leave.pk is not None

    stored_product_detail_leave = ProductDetailLeaveModel.get(
        pk=product_detail_leave.pk
    )
    session = SessionModel.get(pk=session_pk)

    TestCase().assertDictEqual(
        stored_product_detail_leave.dict(), product_detail_leave.dict()
    )

    assert product_detail_leave.session.pk == session.pk
    assert product_detail_leave.session.user_id == session.user_id


def test_product_detail_leave_update(create_product_detail_leave):
    product_detail_leave_pk = create_product_detail_leave
    product_detail_leave = ProductDetailLeaveModel.get(pk=product_detail_leave_pk)

    product_detail_leave.create_at = datetime.now()
    with pytest.raises(TypeError):
        product_detail_leave.save()


def test_product_detail_leave_refresh(create_product_detail_leave):
    product_detail_leave_pk = create_product_detail_leave
    product_detail_leave = ProductDetailLeaveModel.get(pk=product_detail_leave_pk)

    with pytest.raises(TypeError):
        product_detail_leave.refresh()


def test_product_detail_leave_delete(create_product_detail_leave):
    product_detail_leave_pk = create_product_detail_leave
    product_detail_leave = ProductDetailLeaveModel.get(pk=product_detail_leave_pk)

    with pytest.raises(TypeError):
        product_detail_leave.delete()
