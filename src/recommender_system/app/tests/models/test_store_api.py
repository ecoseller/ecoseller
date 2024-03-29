from datetime import datetime

import pytest

from recommender_system.models.api.category import Category
from recommender_system.models.api.product_variant import ProductVariant
from recommender_system.models.stored.product.attribute import AttributeModel
from recommender_system.models.stored.product.attribute_product_variant import (
    AttributeProductVariantModel,
)
from recommender_system.models.stored.product.category_ancestor import (
    CategoryAncestorModel,
)
from recommender_system.models.stored.product.product import ProductModel
from recommender_system.models.stored.product.product_product_variant import (
    ProductProductVariantModel,
)
from recommender_system.models.stored.product.product_variant import ProductVariantModel
from tests.storage.tools import get_or_create_model, delete_model


def delete_attributes(product_variant_pk: str):
    for apv in AttributeProductVariantModel.gets(
        product_variant_sku=product_variant_pk
    ):
        try:
            AttributeModel.get(pk=apv.attribute_id).delete()
        except AttributeModel.DoesNotExist:
            pass
        apv.delete()


def delete_products(product_variant_pk: str):
    for ppv in ProductProductVariantModel.gets(product_variant_sku=product_variant_pk):
        try:
            ProductModel.get(pk=ppv.product_id).delete()
        except ProductModel.DoesNotExist:
            pass
        ppv.delete()


@pytest.fixture
def prepare_categories():
    new_category_id = 6
    new_category_parent_id = 3

    ancestors = [
        CategoryAncestorModel(category_id=1, category_ancestor_id=1),
        CategoryAncestorModel(category_id=2, category_ancestor_id=2),
        CategoryAncestorModel(category_id=3, category_ancestor_id=3),
        CategoryAncestorModel(category_id=4, category_ancestor_id=4),
        CategoryAncestorModel(category_id=5, category_ancestor_id=5),
        CategoryAncestorModel(category_id=2, category_ancestor_id=1),
        CategoryAncestorModel(category_id=3, category_ancestor_id=2),
        CategoryAncestorModel(category_id=3, category_ancestor_id=1),
        CategoryAncestorModel(category_id=4, category_ancestor_id=2),
        CategoryAncestorModel(category_id=4, category_ancestor_id=1),
        CategoryAncestorModel(category_id=5, category_ancestor_id=3),
        CategoryAncestorModel(category_id=5, category_ancestor_id=2),
        CategoryAncestorModel(category_id=5, category_ancestor_id=1),
    ]

    for category in range(1, 7):
        for ancestor in CategoryAncestorModel.gets(category_id=category):
            ancestor.delete()

    for ancestor in ancestors:
        ancestor.create()

    yield new_category_id, new_category_parent_id

    for category in range(1, 7):
        for ancestor in CategoryAncestorModel.gets(category_id=category):
            ancestor.delete()


@pytest.fixture
def clear_product_variant():
    product_variant_sku = "sku"
    product = get_or_create_model(model_class=ProductModel)

    delete_model(model_class=ProductVariantModel, pk=product_variant_sku)

    yield product_variant_sku, product.pk

    delete_attributes(product_variant_pk=product_variant_sku)
    delete_products(product_variant_pk=product_variant_sku)
    delete_model(model_class=ProductVariantModel, pk=product_variant_sku)
    delete_model(model_class=ProductModel, pk=product.pk)


@pytest.fixture
def create_product_variant():
    product = get_or_create_model(model_class=ProductModel)
    product_variant = get_or_create_model(model_class=ProductVariantModel)

    yield product_variant.pk

    delete_attributes(product_variant_pk=product_variant.sku)
    delete_products(product_variant_pk=product_variant.pk)
    delete_model(model_class=ProductVariantModel, pk=product_variant.pk)
    delete_model(model_class=ProductModel, pk=product.pk)


def test_category(prepare_categories):
    category_id, category_parent_id = prepare_categories

    assert len(CategoryAncestorModel.gets(category_id=category_id)) == 0

    category = Category(id=category_id, parent_id=category_parent_id)
    category.save()

    assert {1, 2, 3, 6} == {
        ancestor.category_ancestor_id
        for ancestor in CategoryAncestorModel.gets(category_id=category_id)
    }


def test_product_variant_create(clear_product_variant):
    product_variant_sku, product_pk = clear_product_variant
    product_variant_dict = {
        "sku": product_variant_sku,
        "ean": "ean",
        "weight": 0.0,
        "stock_quantity": 1,
        "recommendation_weight": 1.0,
        "update_at": datetime.now().isoformat(),
        "create_at": datetime.now().isoformat(),
        "attributes": [],
    }

    with pytest.raises(ProductVariantModel.DoesNotExist):
        _ = ProductVariantModel.get(pk=product_variant_sku)

    product_variant = ProductVariant.parse_obj(product_variant_dict)
    product_variant.save()

    stored_product_variant = ProductVariantModel.get(pk=product_variant_sku)

    assert stored_product_variant.sku == product_variant.sku
    assert stored_product_variant.ean == product_variant.ean
    assert stored_product_variant.weight == product_variant.weight
    assert stored_product_variant.update_at == product_variant.update_at
    assert stored_product_variant.create_at == product_variant.create_at
    assert len(stored_product_variant.attributes) == len(product_variant.attributes)


def test_product_variant_update(create_product_variant):
    product_variant_sku = create_product_variant
    product_variant = ProductVariantModel.get(pk=product_variant_sku)
    product_variant = ProductVariant(
        sku=product_variant.sku,
        ean=product_variant.ean,
        weight=product_variant.weight,
        stock_quantity=1,
        recommendation_weight=product_variant.recommendation_weight,
        update_at=product_variant.update_at,
        create_at=product_variant.create_at,
        attributes=[attribute.id for attribute in product_variant.attributes],
    )

    assert product_variant.ean != "unittest"

    product_variant.ean = "unittest"
    product_variant.save()

    stored_product_variant = ProductVariantModel.get(pk=product_variant_sku)

    assert stored_product_variant.sku == product_variant.sku
    assert stored_product_variant.ean == product_variant.ean
    assert stored_product_variant.weight == product_variant.weight
    assert stored_product_variant.update_at == product_variant.update_at
    assert stored_product_variant.create_at == product_variant.create_at
    assert len(stored_product_variant.attributes) == len(product_variant.attributes)
