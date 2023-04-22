from unittest import TestCase

import pytest

from recommender_system.models.stored.product_price import ProductPriceModel
from recommender_system.models.stored.product_variant import ProductVariantModel
from tests.storage.tools import get_or_create_model, delete_model, default_dicts


@pytest.fixture
def clear_product_price():
    product_price_pk = 0
    product = get_or_create_model(model_class=ProductVariantModel)

    delete_model(model_class=ProductPriceModel, pk=product_price_pk)

    yield product_price_pk, product.pk

    delete_model(model_class=ProductPriceModel, pk=product_price_pk)
    delete_model(model_class=ProductVariantModel, pk=product.pk)


@pytest.fixture
def create_product_price():
    product = get_or_create_model(model_class=ProductVariantModel)
    product_price = get_or_create_model(model_class=ProductPriceModel)

    yield product_price.pk

    delete_model(model_class=ProductPriceModel, pk=product_price.pk)
    delete_model(model_class=ProductVariantModel, pk=product.pk)


def test_product_price_create(clear_product_price):
    product_price_pk, product_pk = clear_product_price
    product_price_dict = default_dicts[ProductPriceModel]

    with pytest.raises(ProductPriceModel.DoesNotExist):
        _ = ProductPriceModel.get(pk=product_price_pk)

    product_price = ProductPriceModel.parse_obj(product_price_dict)
    product_price.create()

    stored_product_price = ProductPriceModel.get(pk=product_price_pk)

    TestCase().assertDictEqual(stored_product_price.dict(), product_price.dict())


def test_product_price_update(create_product_price):
    product_price_pk = create_product_price
    product_price = ProductPriceModel.get(pk=product_price_pk)

    assert product_price.price != 0.0

    product_price.price = 0.0
    product_price.save()

    stored_product_price = ProductPriceModel.get(pk=product_price.pk)

    assert stored_product_price.pk == product_price.pk
    assert stored_product_price.price == 0.0


def test_product_price_refresh(create_product_price):
    product_price_pk = create_product_price
    product_price = ProductPriceModel.get(pk=product_price_pk)

    modified_product_price = product_price.copy()
    modified_product_price.price = 0.0
    modified_product_price.save()

    assert modified_product_price.price == 0.0
    assert product_price.price != 0.0

    product_price.refresh()

    assert product_price.price == modified_product_price.price


def test_product_price_delete(create_product_price):
    product_price_pk = create_product_price
    product_price = ProductPriceModel.get(pk=product_price_pk)

    product_price.delete()

    with pytest.raises(ProductPriceModel.DoesNotExist):
        _ = ProductPriceModel.get(pk=product_price_pk)
