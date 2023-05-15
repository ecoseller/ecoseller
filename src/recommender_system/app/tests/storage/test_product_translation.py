from unittest import TestCase

import pytest

from recommender_system.models.stored.product.product import ProductModel
from recommender_system.models.stored.product.product_translation import (
    ProductTranslationModel,
)
from tests.storage.tools import get_or_create_model, delete_model, default_dicts


@pytest.fixture
def clear_product_translation():
    product_translation_pk = 0
    product = get_or_create_model(model_class=ProductModel)

    delete_model(model_class=ProductTranslationModel, pk=product_translation_pk)

    yield product_translation_pk, product.pk

    delete_model(model_class=ProductTranslationModel, pk=product_translation_pk)
    delete_model(model_class=ProductModel, pk=product.pk)


@pytest.fixture
def create_product_translation():
    product = get_or_create_model(model_class=ProductModel)
    product_translation = get_or_create_model(model_class=ProductTranslationModel)

    yield product_translation.pk

    delete_model(model_class=ProductTranslationModel, pk=product_translation.pk)
    delete_model(model_class=ProductModel, pk=product.pk)


def test_product_translation_create(clear_product_translation):
    product_translation_pk, product_pk = clear_product_translation
    product_translation_dict = default_dicts[ProductTranslationModel]

    with pytest.raises(ProductTranslationModel.DoesNotExist):
        _ = ProductTranslationModel.get(pk=product_translation_pk)

    product_translation = ProductTranslationModel.parse_obj(product_translation_dict)
    product_translation.create()

    stored_product_translation = ProductTranslationModel.get(pk=product_translation_pk)

    TestCase().assertDictEqual(
        stored_product_translation.dict(), product_translation.dict()
    )


def test_product_translation_update(create_product_translation):
    product_translation_pk = create_product_translation
    product_translation = ProductTranslationModel.get(pk=product_translation_pk)

    assert product_translation.title != "unittest"

    product_translation.title = "unittest"
    product_translation.save()

    stored_product_translation = ProductTranslationModel.get(pk=product_translation.pk)

    assert stored_product_translation.pk == product_translation.pk
    assert stored_product_translation.title == "unittest"


def test_product_translation_refresh(create_product_translation):
    product_translation_pk = create_product_translation
    product_translation = ProductTranslationModel.get(pk=product_translation_pk)

    modified_product_translation = product_translation.copy()
    modified_product_translation.title = "unittest"
    modified_product_translation.save()

    assert modified_product_translation.title == "unittest"
    assert product_translation.title != "unittest"

    product_translation.refresh()

    assert product_translation.title == modified_product_translation.title


def test_product_translation_delete(create_product_translation):
    product_translation_pk = create_product_translation
    product_translation = ProductTranslationModel.get(pk=product_translation_pk)

    product_translation.delete()

    with pytest.raises(ProductTranslationModel.DoesNotExist):
        _ = ProductTranslationModel.get(pk=product_translation_pk)
