from category.models import Category
from product.models import (
    Product,
    ProductType,
    ProductVariant,
    ProductMedia,
    ProductPrice,
    PriceList,
    BaseAttribute,
    AttributeType,
)
import json
import random
from django.utils.text import slugify


MOVIE_CATEGORY = Category.objects.get(id=3)
MOVIE_TYPE = ProductType.objects.get(name="Movie")

CZK_PRICE_LIST = PriceList.objects.get(code="CZK_retail")
EUR_PRICE_LIST = PriceList.objects.get(code="EUR_retail")
PLN_PRICE_LIST = PriceList.objects.get(code="PLN_retail")

language_en = BaseAttribute.objects.get(
    type__type_name="LANGUAGE",
    value="EN",
)
language_cs = BaseAttribute.objects.get(
    type__type_name="LANGUAGE",
    value="EN",
)
resolution_1080 = BaseAttribute.objects.get(
    type__type_name="RESOLUTION",
    value="1080",
)
resolution_720 = BaseAttribute.objects.get(
    type__type_name="RESOLUTION",
    value="720",
)


def load_json():
    with open("../demo_data/dump_with_reviews.json", "r") as file:
        data = json.load(file)
        return data


def make_variant(sku, attributes):
    print(f"Making variant with SKU: {sku}")
    print(f"Attributes: {attributes}")
    attribute_ids = [attr.id for attr in attributes]
    print(f"Attribute ids: {attribute_ids}")
    try:
        variant_obj = ProductVariant.objects.get(
            sku=sku,
            # weight=random.randint(100, 250),
            # stock_quantity=random.randint(0, 100),
            # attributes=attribute_ids,
        )
    except ProductVariant.DoesNotExist:
        variant_obj = ProductVariant(
            sku=sku,
            weight=random.randint(100, 250),
            stock_quantity=random.randint(0, 100),
            # attributes=attribute_ids,
        )
        variant_obj.save()
    variant_obj.attributes.set(attributes)
    variant_obj.save()
    return variant_obj


def create_variants(product_obj, common_attributes, id):
    # so that we make a bit more realistic, we'll create two variants for each product if it's ID mod 2 == 0
    # so that we will have CS variant and EN variant + we will flip a coin to decide which will be 1080p and which will be 720p
    # if ID mod 2 == 1, we'll create only one variant
    variants = []

    if int(id) % 2 == 0:
        # create 2 variants
        # flip a coin
        coin = random.randint(0, 1)
        if coin == 0:
            # create EN 1080p
            variant = make_variant(
                sku=f"{id}-en-1080p",
                attributes=[
                    *common_attributes,
                    language_en,
                    resolution_1080,
                ],
            )
        else:
            # create EN 720p
            variant = make_variant(
                sku=f"{id}-en-720p",
                attributes=[
                    *common_attributes,
                    language_en,
                    resolution_720,
                ],
            )
        variants.append(variant)
        coin = random.randint(0, 1)
        if coin == 0:
            # create CS 1080p

            variant = make_variant(
                sku=f"{id}-cs-1080p",
                attributes=[
                    *common_attributes,
                    language_cs,
                    resolution_1080,
                ],
            )
        else:
            # create CS 720p
            variant = make_variant(
                sku=f"{id}-cs-720p",
                attributes=[
                    *common_attributes,
                    language_cs,
                    resolution_720,
                ],
            )
        variants.append(variant)

    else:
        # create 1 variant only EN or CS 1080p or 720p
        coin = random.randint(0, 1)
        if coin == 0:
            # create EN
            resolution_coin = random.randint(0, 1)
            if resolution_coin == 0:
                # create 1080p
                variant = make_variant(
                    sku=f"{id}-en-1080p",
                    attributes=[
                        *common_attributes,
                        language_en,
                        resolution_1080,
                    ],
                )
            else:
                # create 720p
                variant = make_variant(
                    sku=f"{id}-en-720p",
                    attributes=[
                        *common_attributes,
                        language_en,
                        resolution_720,
                    ],
                )
        else:
            # create CS
            resolution_coin = random.randint(0, 1)
            if resolution_coin == 0:
                # create 1080p
                variant = make_variant(
                    sku=f"{id}-cs-1080p",
                    attributes=[
                        *common_attributes,
                        language_cs,
                        resolution_1080,
                    ],
                )
            else:
                # create 720p
                variant = make_variant(
                    sku=f"{id}-cs-720p",
                    attributes=[
                        *common_attributes,
                        language_cs,
                        resolution_720,
                    ],
                )
        variants.append(variant)

    return variants


def create_prices_for_variant(variant_obj):
    try:
        price_obj = ProductPrice.objects.get(
            product_variant=variant_obj,
            price_list=CZK_PRICE_LIST,
        )
    except ProductPrice.DoesNotExist:
        price_obj = ProductPrice(
            product_variant=variant_obj, price_list=CZK_PRICE_LIST, price=0
        )

    price_obj.price = random.randint(100, 250)
    if variant_obj.attributes.filter(value="1080").exists():
        price_obj.price += random.randint(30, 100)  # 1080p is more expensive
    if variant_obj.attributes.filter(value="EN").exists():
        price_obj.price += random.randint(20, 60)  # EN is more expensive
    price_obj.save()

    price_int_czk = price_obj.price
    # create price for PLN
    try:
        price_obj = ProductPrice.objects.get(
            product_variant=variant_obj,
            price_list=PLN_PRICE_LIST,
        )
    except ProductPrice.DoesNotExist:
        price_obj = ProductPrice(
            product_variant=variant_obj, price_list=PLN_PRICE_LIST, price=0
        )
    price_obj.price = price_int_czk / 5
    price_obj.save()

    # create price for EUR
    try:
        price_obj = ProductPrice.objects.get(
            product_variant=variant_obj,
            price_list=EUR_PRICE_LIST,
        )
    except ProductPrice.DoesNotExist:
        price_obj = ProductPrice(
            product_variant=variant_obj, price_list=EUR_PRICE_LIST, price=0
        )
    price_obj.price = price_int_czk / 23
    price_obj.save()


def parse_product(id, data):
    # create product
    product_obj, created = Product.objects.get_or_create(
        pk=int(id),
        type=MOVIE_TYPE,
        category=MOVIE_CATEGORY,
    )
    # create product translations
    product_obj.set_current_language("en")
    product_obj.title = data["title"]
    product_obj.meta_title = data["title"]
    product_obj.slug = slugify(data["title"])
    product_obj.set_current_language("cs")
    product_obj.title = data["title"]
    product_obj.meta_title = data["title"]
    product_obj.slug = slugify(data["title"])
    product_obj.save()

    # VARIANTS and PRICES are loaded in the database, so uncommenting this for now

    # # create general attribtues (genre, length, year)
    # genre_type = AttributeType.objects.get(
    #     type_name="GENRE",
    # )
    # genre, created = BaseAttribute.objects.get_or_create(
    #     type=genre_type,
    #     value=data["genre"],
    # )
    # year_type = AttributeType.objects.get(
    #     type_name="YEAR",
    # )
    # year, created = BaseAttribute.objects.get_or_create(
    #     type=year_type,
    #     value=data["year"],
    # )
    # length_type = AttributeType.objects.get(
    #     type_name="LENGTH",
    # )

    # length = BaseAttribute.objects.get(
    #     type=length_type,
    #     value="SUB60",
    # )

    # if int(data["runtime"]) > 120:
    #     length = BaseAttribute.objects.get(
    #         type=length_type,
    #         value="120PLUS",
    #     )
    # elif int(data["runtime"]) > 90:
    #     length = BaseAttribute.objects.get(
    #         type=length_type,
    #         value="90120",
    #     )
    # elif int(data["runtime"]) > 60:
    #     length = BaseAttribute.objects.get(
    #         type=length_type,
    #         value="6090",
    #     )

    # common_attributes = [genre, year, length]

    # # create product variant
    # variants = create_variants(product_obj, common_attributes, id)
    # product_obj.product_variants.set(variants)
    # # for each variant create price
    # for variant in variants:
    #     create_prices_for_variant(
    #         variant_obj=variant,
    #     )
    #     print(f"Created variant {variant}")
    # print(f"Created product {product_obj}")


# load json
data = load_json()
# loop over products in json (they're as objects)

for key, value in data.items():
    print(f"Parsing product {key}")
    parse_product(key, value)
