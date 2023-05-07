from datetime import datetime
from unittest import TestCase

import pytest

from recommender_system.models.stored.feedback.product_add_to_cart import (
    ProductAddToCartModel,
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
def create_product_add_to_cart():
    product_add_to_cart = get_or_create_model(model_class=ProductAddToCartModel)

    yield product_add_to_cart.pk

    delete_model(model_class=ProductAddToCartModel, pk=product_add_to_cart.pk)


def test_product_add_to_cart_create(clear_session):
    session_pk = clear_session
    product_add_to_cart_dict = default_dicts[ProductAddToCartModel]

    with pytest.raises(SessionModel.DoesNotExist):
        _ = SessionModel.get(pk=session_pk)

    product_add_to_cart = ProductAddToCartModel.parse_obj(product_add_to_cart_dict)
    product_add_to_cart.create()
    assert product_add_to_cart.pk is not None

    stored_product_add_to_cart = ProductAddToCartModel.get(pk=product_add_to_cart.pk)
    session = SessionModel.get(pk=session_pk)

    TestCase().assertDictEqual(
        stored_product_add_to_cart.dict(), product_add_to_cart.dict()
    )

    assert product_add_to_cart.session.pk == session.pk
    assert product_add_to_cart.session.user_id == session.user_id


def test_product_add_to_cart_update(create_product_add_to_cart):
    product_add_to_cart_pk = create_product_add_to_cart
    product_add_to_cart = ProductAddToCartModel.get(pk=product_add_to_cart_pk)

    product_add_to_cart.create_at = datetime.now()
    with pytest.raises(TypeError):
        product_add_to_cart.save()


def test_product_add_to_cart_refresh(create_product_add_to_cart):
    product_add_to_cart_pk = create_product_add_to_cart
    product_add_to_cart = ProductAddToCartModel.get(pk=product_add_to_cart_pk)

    with pytest.raises(TypeError):
        product_add_to_cart.refresh()


def test_product_add_to_cart_delete(create_product_add_to_cart):
    product_add_to_cart_pk = create_product_add_to_cart
    product_add_to_cart = ProductAddToCartModel.get(pk=product_add_to_cart_pk)

    with pytest.raises(TypeError):
        product_add_to_cart.delete()
