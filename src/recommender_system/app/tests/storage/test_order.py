from datetime import datetime
from unittest import TestCase

import pytest

from recommender_system.models.stored.product.order import OrderModel
from recommender_system.models.stored.product.order_product_variant import (
    OrderProductVariantModel,
)
from recommender_system.models.stored.product.product_variant import ProductVariantModel
from tests.storage.tools import get_or_create_model, delete_model, default_dicts


def delete_product_variants(order_pk: int):
    for opv in OrderProductVariantModel.gets(order_id=order_pk):
        try:
            ProductVariantModel.get(pk=opv.product_variant_sku).delete()
        except ProductVariantModel.DoesNotExist:
            pass
        opv.delete()


@pytest.fixture
def clear_order():
    order_pk = 0

    delete_model(model_class=OrderModel, pk=order_pk)

    yield order_pk

    delete_model(model_class=OrderModel, pk=order_pk)


@pytest.fixture
def create_order():
    order = get_or_create_model(model_class=OrderModel)

    yield order.pk

    delete_product_variants(order_pk=order.pk)
    delete_model(model_class=OrderModel, pk=order.pk)


def test_order_create(clear_order):
    order_pk = clear_order
    order_dict = default_dicts[OrderModel]

    with pytest.raises(OrderModel.DoesNotExist):
        _ = OrderModel.get(pk=order_pk)

    order = OrderModel.parse_obj(order_dict)
    order.create()

    stored_order = OrderModel.get(pk=order_pk)

    TestCase().assertDictEqual(stored_order.dict(), order.dict())


def test_order_update(create_order):
    order_pk = create_order
    order = OrderModel.get(pk=order_pk)

    new_session_id = "unittest"

    order.session_id = "unittest"
    order.save()

    stored_order = OrderModel.get(pk=order.pk)

    assert stored_order.pk == order.pk
    assert stored_order.session_id == new_session_id


def test_order_refresh(create_order):
    order_pk = create_order
    order = OrderModel.get(pk=order_pk)

    modified_order = order.copy()
    modified_order.session_id = "unittest"
    modified_order.save()

    assert modified_order.session_id != order.session_id

    order.refresh()

    assert order.session_id == modified_order.session_id


def test_order_delete(create_order):
    order_pk = create_order
    order = OrderModel.get(pk=order_pk)

    order.delete()

    with pytest.raises(OrderModel.DoesNotExist):
        _ = OrderModel.get(pk=order_pk)


def test_order_product_variants(create_order):
    order_pk = create_order
    order = OrderModel.get(pk=order_pk)

    variant_dict = default_dicts[ProductVariantModel]

    old_variants = len(order.product_variants)

    product_variant = ProductVariantModel.parse_obj(variant_dict)
    product_variant.sku = datetime.now().isoformat()
    product_variant.create()

    order.add_product_variant(product_variant=product_variant, amount=1)

    assert len(order.product_variants) == old_variants + 1
