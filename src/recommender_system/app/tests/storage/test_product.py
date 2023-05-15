from datetime import datetime
from unittest import TestCase

import pytest

from recommender_system.models.stored.product.product import ProductModel
from recommender_system.models.stored.product.product_product_variant import (
    ProductProductVariantModel,
)
from recommender_system.models.stored.product.product_translation import (
    ProductTranslationModel,
)
from recommender_system.models.stored.product.product_variant import ProductVariantModel
from tests.storage.tools import get_or_create_model, delete_model, default_dicts


def delete_product_variants(product_pk: int):
    for ppv in ProductProductVariantModel.gets(product_id=product_pk):
        try:
            ProductVariantModel.get(pk=ppv.product_variant_sku).delete()
        except ProductVariantModel.DoesNotExist:
            pass
        ppv.delete()


def delete_translations(product_pk: int):
    for product_translation in ProductTranslationModel.gets(product_id=product_pk):
        product_translation.delete()


@pytest.fixture
def clear_product():
    product_pk = 0

    delete_model(model_class=ProductModel, pk=product_pk)

    yield product_pk

    delete_model(model_class=ProductModel, pk=product_pk)


@pytest.fixture
def create_product():
    product = get_or_create_model(model_class=ProductModel)

    yield product.pk

    delete_product_variants(product_pk=product.pk)
    delete_translations(product_pk=product.pk)
    delete_model(model_class=ProductModel, pk=product.pk)


def test_product_create(clear_product):
    product_pk = clear_product
    product_dict = default_dicts[ProductModel]

    with pytest.raises(ProductModel.DoesNotExist):
        _ = ProductModel.get(pk=product_pk)

    product = ProductModel.parse_obj(product_dict)
    product.create()

    stored_product = ProductModel.get(pk=product_pk)

    TestCase().assertDictEqual(stored_product.dict(), product.dict())


def test_product_update(create_product):
    product_pk = create_product
    product = ProductModel.get(pk=product_pk)

    new_published = not product.published

    product.published = not product.published
    product.save()

    stored_product = ProductModel.get(pk=product.pk)

    assert stored_product.pk == product.pk
    assert stored_product.published == new_published


def test_product_refresh(create_product):
    product_pk = create_product
    product = ProductModel.get(pk=product_pk)

    modified_product = product.copy()
    modified_product.published = not product.published
    modified_product.save()

    assert modified_product.published != product.published

    product.refresh()

    assert product.published == modified_product.published


def test_product_delete(create_product):
    product_pk = create_product
    product = ProductModel.get(pk=product_pk)

    product.delete()

    with pytest.raises(ProductModel.DoesNotExist):
        _ = ProductModel.get(pk=product_pk)


def test_product_product_translations(create_product):
    product_pk = create_product
    product = ProductModel.get(pk=product_pk)

    translation_dict = default_dicts[ProductTranslationModel]
    translation_dict["product_id"] = product.pk

    old_translations = len(product.translations)

    translation = ProductTranslationModel.parse_obj(translation_dict)
    translation.id = None
    translation.create()

    assert len(product.translations) == old_translations + 1


def test_product_product_variants(create_product):
    product_pk = create_product
    product = ProductModel.get(pk=product_pk)

    variant_dict = default_dicts[ProductVariantModel]

    old_variants = len(product.product_variants)

    product_variant = ProductVariantModel.parse_obj(variant_dict)
    product_variant.sku = datetime.now().isoformat()
    product_variant.create()

    product.add_product_variant(product_variant=product_variant)

    assert len(product.product_variants) == old_variants + 1
