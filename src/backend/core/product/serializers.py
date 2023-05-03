import re
from core.mixins import (
    TranslatedSerializerMixin,
)
from rest_framework.serializers import (
    ModelSerializer,
    CharField,
    ValidationError,
    PrimaryKeyRelatedField,
)
from rest_framework import serializers

from parler_rest.serializers import (
    TranslatableModelSerializer,
    TranslatedFieldsField,
)

from django.db.models import (
    Max,
)

from category.serializers import (
    CategorySerializer,
)
from country.serializers import (
    CurrencySerializer,
)

from product.models import (
    Product,
    ProductVariant,
    ProductPrice,
    PriceList,
    ProductMedia,
    AttributeType,
    BaseAttribute,
    ProductMediaTypes,
    ProductType,
)

"""
Common serializers
"""


class ProductMediaBaseSerializer(ModelSerializer):
    media = serializers.ImageField(required=False, use_url=True)
    type = serializers.ChoiceField(choices=ProductMediaTypes.CHOICES, required=False)

    class Meta:
        model = ProductMedia
        fields = (
            "id",
            "media",
            "type",
            "alt",
        )


class ProductMediaDetailsSerializer(ProductMediaBaseSerializer):
    # product_id = serializers.ReadOnlyField(source="product.id")
    product_id = serializers.PrimaryKeyRelatedField(
        many=False,
        queryset=Product.objects.all(),
        source="product",
        required=False,
        # write_only=True,
    )
    sort_order = serializers.IntegerField(required=False)

    class Meta(ProductMediaBaseSerializer.Meta):
        model = ProductMedia
        order_by = ["sort_order"]
        fields = ProductMediaBaseSerializer.Meta.fields + (
            "product_id",
            "sort_order",
        )


class PriceListBaseSerializer(ModelSerializer):
    class Meta:
        model = PriceList
        fields = (
            "code",
            "currency",
            "rounding",
            "includes_vat",
            "update_at",
            "create_at",
        )


class PriceListSerializer(PriceListBaseSerializer):
    currency = CurrencySerializer(read_only=True, many=False)

    class Meta:
        model = PriceList
        fields = (
            "id",
            "name",
            "currency",
            "rounding",
            "includes_vat",
            "update_at",
            "create_at",
        )


"""
Dashboard serializers
"""


class ProductPriceListSerializer(serializers.ListSerializer):
    def create(self, validated_data, **kwargs):
        """
        Create new price
        """
        product_variant = kwargs.get("product_variant", None)
        if not product_variant:
            raise "Product variant is required"

        prices = []
        for price in validated_data:
            price_list = price.pop("price_list")
            price = price.pop("price")
            try:
                price_obj = ProductPrice.objects.get(
                    price_list=price_list,
                    product_variant=product_variant,
                )
                price_obj.price = price
            except ProductPrice.DoesNotExist:
                price_obj = ProductPrice.objects.create(
                    price_list=price_list,
                    product_variant=product_variant,
                    price=price,
                )
            price_obj.save()
            prices.append(price_obj)

        return prices


class ProductPriceSerializer(ModelSerializer):
    # price_list = PriceListSerializer(read_only=True, many=False) <-- TODO: ucommenting this line breaks the serializer or at least
    # the price_list field is not serialized correctly when sent as:
    # {"price_list": "CZK_maloobchod", "price": 1000} <-- price list is not serialized and hence not returned

    class Meta:
        list_serializer_class = ProductPriceListSerializer
        model = ProductPrice
        fields = (
            "id",
            "price",
            "price_list",
        )

    def validate(self, attrs):
        """
        Validate price
        """
        price = attrs.get("price", None)
        if price is None:
            raise ValidationError("Price is required")
        if price < 0:
            raise ValidationError("Price must be greater than 0")
        return attrs

    def create(self, validated_data):
        """
        Create new price
        """
        print(validated_data)
        price_list = validated_data.pop("price_list")
        price = validated_data.pop("price")

        return ProductPrice.objects.create(
            price_list=price_list,
            price=price,
        )

    def update(self, instance, validated_data):
        """
        Update existing price
        """
        price = validated_data.pop("price", None)
        if price is not None:
            instance.price = price
        instance.save()
        return instance


class ProductVariantListSerializer(serializers.ListSerializer):
    """
    Product Variant List Serializer (see product/models.py)
    used to create/update multiple variants at once
    """

    def update(self, instance, validated_data):
        """
        Update and return a list of `ProductVariant` instances, given the validated data.
        """
        variant_mapping = {variant.sku: variant for variant in instance}
        data_mapping = {item["sku"]: item for item in validated_data}

        ret = []
        for sku, data in data_mapping.items():
            variant = variant_mapping.get(sku, None)
            if variant is None:
                ret.append(self.child.create(data))
            else:
                ret.append(self.child.update(variant, data))

        for sku, variant in variant_mapping.items():
            if sku not in data_mapping:
                variant.delete()

        return ret


class ProductVariantSerializer(ModelSerializer):
    """
    Product Variant Serializer (see product/models.py)
    returns only basic variant fields such as SKU, EAN, weight
    TODO: price, stock, attributes
    """

    sku = CharField()
    price = ProductPriceSerializer(many=True, read_only=False, required=False)

    class Meta:
        model = ProductVariant
        list_serializer_class = ProductVariantListSerializer
        fields = (
            "sku",
            "ean",
            "weight",
            "price",
            "attributes",
        )

    def validate(self, attrs):
        """
        Validate SKU
        """
        sku = attrs.get("sku", None)
        sku_re = re.compile("^[a-zA-Z0-9-_]+$")

        if not sku:
            raise ValidationError("SKU is required")
        # validate sku contains only allowed chars
        if not sku_re.match(sku):
            raise ValidationError("SKU can only contain letters and numbers")
        self.instance, created = ProductVariant.objects.get_or_create(sku=sku)

        return attrs

    # overload create method to to save nested prices as well
    # uses update_or_create to update existing SKUs
    def create(self, validated_data):
        prices_validated_data = validated_data.pop("price", [])
        attributes = validated_data.pop("attributes", [])
        instance, created = ProductVariant.objects.update_or_create(
            sku=validated_data["sku"], defaults=validated_data
        )
        self.instance = instance

        # set product attributes
        if len(attributes) > 0:
            instance.attributes.set(attributes)
        else:
            instance.attributes.clear()

        # create product prices
        if len(prices_validated_data) > 0:
            prices_serializer = self.fields["price"]
            prices_serializer.create(prices_validated_data, product_variant=instance)
        else:
            ProductPrice.objects.filter(product_variant=instance).delete()
        return instance

    def update(self, instance, validated_data):
        prices_validated_data = validated_data.pop("price", [])
        attributes_validated_data = validated_data.pop("attributes", [])

        # instance = super().update(instance, validated_data)
        if len(attributes_validated_data) > 0:
            instance.attributes.set(attributes_validated_data)
        else:
            instance.attributes.clear()

        instance = super().update(instance, validated_data)

        # create product prices
        if len(prices_validated_data) > 0:
            print(prices_validated_data)
            prices_serializer = self.fields["price"]
            prices_serializer.create(prices_validated_data, product_variant=instance)
        else:
            ProductPrice.objects.filter(product_variant=instance).delete()
        return instance


class BaseAttributeDashboardSerializer(ModelSerializer):
    class Meta:
        model = BaseAttribute
        fields = (
            "id",
            "value",
            "type",
            # "order",
            # "ext_attributes",
        )


class AtrributeTypeDashboardSerializer(ModelSerializer):
    base_attributes = BaseAttributeDashboardSerializer(many=True, read_only=True)

    class Meta:
        model = AttributeType
        fields = (
            "id",
            "type_name",
            "unit",
            "base_attributes",
            "value_type",
        )


class ProductTypeSerializer(ModelSerializer):
    # name = CharField(required=False)
    allowed_attribute_types = AtrributeTypeDashboardSerializer(
        many=True, read_only=True
    )
    allowed_attribute_types_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=AttributeType.objects.all(),
        source="allowed_attribute_types",
        # write_only=True,
    )
    create_at = serializers.DateTimeField(read_only=True)
    update_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = ProductType
        fields = (
            "id",
            "name",
            "allowed_attribute_types",
            "allowed_attribute_types_ids",
            "create_at",
            "update_at",
        )


class ProductDashboardListSerializer(TranslatedSerializerMixin, ModelSerializer):
    """
    Product Dashboard Serializer (see product/models.py)
    returns product fields for dashboard
    """

    primary_image = ProductMediaDetailsSerializer(
        read_only=True, many=False, source="get_primary_photo"
    )

    class Meta:
        model = Product
        fields = (
            "id",
            "title",
            "slug",
            "primary_image",
            "published",
            "create_at",
            "update_at",
        )


class ProductDashboardDetailSerializer(TranslatableModelSerializer, ModelSerializer):
    translations = TranslatedFieldsField(shared_model=Product, required=False)
    product_variants = ProductVariantSerializer(
        many=True, read_only=False, required=False
    )
    id = CharField(required=False, read_only=True)  # for update
    media = ProductMediaDetailsSerializer(
        many=True, source="product_media", read_only=True
    )
    type_id = PrimaryKeyRelatedField(
        required=False, write_only=True, queryset=ProductType.objects.all()
    )  # for update
    type = ProductTypeSerializer(read_only=True)  # for read

    class Meta:
        model = Product
        fields = (
            "id",
            "published",
            "translations",  # translations object with all translations
            "category",  # serialized as id
            "product_variants",  # serialized as list of ids
            "update_at",
            "create_at",
            "media",
            "type",
            "type_id",
        )

    def validate(self, attrs):
        # validate that product has unique id
        print("VALIDATE", attrs)
        if "id" in attrs and attrs["id"] is not None:
            # if id is not present in attrs, it means that we are updating the product
            # in this case we need to check if there are any variants with the same SKU
            # as the product itself
            try:
                self.instance = Product.objects.get(id=attrs["id"])
            except Product.DoesNotExist:
                pass

            del attrs["id"]
        # else:
        #     # if id is not present in attrs, it means that we are creating the product
        #     # so we take maximum id from all products and add 1 to it
        #     # this is not the best solution, but it works for now
        #     max_id = Product.objects.all().aggregate(Max("id"))["id__max"]
        #     if max_id is None:
        #         max_id = 0
        #     attrs["id"] = max_id + 1
        #     print(attrs["id"])

        return attrs

    def create(self, validated_data):
        # overload create method to to save nested product_variants as well
        # uses update_or_create to update existing variants
        product_variants_validated_data = validated_data.pop("product_variants", [])
        id = validated_data.pop("id", None)

        if not id:
            # if id is not present in attrs, it means that we are creating the product
            # so we take maximum id from all products and add 1 to it
            # this is not the best solution, but it works for now
            max_id = Product.objects.all().aggregate(Max("id"))["id__max"]
            if max_id is None:
                max_id = 0
            id = int(max_id) + 1

        # create product
        instance, created = Product.objects.get_or_create(
            id=id, defaults=validated_data
        )

        if len(product_variants_validated_data) > 0:
            # create product variants
            product_variants_serializer = self.fields["product_variants"]
            product_variants = product_variants_serializer.create(
                product_variants_validated_data
            )
            instance.product_variants.set(product_variants)
        else:
            instance.product_variants.clear()

        instance.save()

        return instance

    def update(self, instance, validated_data):
        # overload update method to to save nested product_variants as well
        # uses update_or_create to update existing variants
        product_variants_validated_data = validated_data.pop("product_variants", [])

        # update product
        instance = super().update(instance, validated_data)
        if len(product_variants_validated_data) > 0:
            # update product variants (create new or update existing)
            # using defined ListSerializer
            product_variants_serializer = self.fields["product_variants"]
            product_variants = product_variants_serializer.update(
                instance.product_variants.all(), product_variants_validated_data
            )

            instance.product_variants.set(product_variants)
        else:
            instance.product_variants.clear()

        instance = super().update(instance, validated_data)

        instance.save()

        return instance


class ProductDashboardSerializer(TranslatedSerializerMixin, ModelSerializer):
    """
    Basic Product model serializer (see product/models.py) used for dashboard
    retrieving all fields defined in the model with nested list of product variants
    and category.
    Only one translation is returned (see TranslatedSerializerMixin)
    """

    product_variants = ProductVariantSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = (
            "id",
            "published",
            "category",
            "title",
            "meta_title",
            "meta_description",
            "short_description",
            "description",
            "description_editorjs",
            "slug",
            "product_variants",
        )


class AttributeTypeStorefrontSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttributeType
        fields = (
            "id",
            "type_name",
            "unit",
        )


class BaseAttributeStorefrontSerializer(serializers.ModelSerializer):
    type = AttributeTypeStorefrontSerializer(read_only=True)

    class Meta:
        model = BaseAttribute
        fields = (
            "id",
            "order",
            "value",
            "type",
        )


class ProductVariantStorefrontDetailSerializer(ProductVariantSerializer):
    price = serializers.SerializerMethodField()
    attributes = BaseAttributeStorefrontSerializer(many=True, read_only=True)

    def get_price(self, obj):
        print("GET PRICE", obj, self.context)
        if not "pricelist" in self.context:
            return None
        try:
            price = ProductPrice.objects.get(
                product_variant=obj, price_list=self.context["pricelist"]
            )
        except ProductPrice.DoesNotExist:
            return None
        # price_serializer = ProductPriceSerializer(price)
        formatted_price = self.context["pricelist"].format_price(price.price)
        return formatted_price  # price_serializer.data


class ProductStorefrontDetailSerializer(TranslatedSerializerMixin, ModelSerializer):
    """
    Basic Product model serializer (see product/models.py) used for dashboard
    retrieving all fields defined in the model with nested list of product variants
    and category.
    Only one translation is returned (see TranslatedSerializerMixin)
    """

    product_variants = ProductVariantStorefrontDetailSerializer(
        many=True, read_only=True
    )
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = (
            "id",
            "published",
            "category",
            "title",
            "meta_title",
            "meta_description",
            "short_description",
            "description",
            "description_editorjs",
            "slug",
            "product_variants",
        )


class ProductStorefrontListSerializer(TranslatedSerializerMixin, ModelSerializer):
    """
    Product serializer used for storefront when listing products
    Only one translation is returned (see TranslatedSerializerMixin)
    """

    primary_image = ProductMediaBaseSerializer(
        read_only=True, many=False, source="get_primary_photo"
    )

    price = serializers.SerializerMethodField()
    has_multiple_prices = serializers.SerializerMethodField()

    def _get_variant_prices(self, product):
        """
        Get all product variants prices of the given product.
        Price list is taken from self.context.
        """
        price_list = self.context.get("price_list")
        variants = product.product_variants.all()

        return ProductPrice.objects.filter(
            product_variant__in=variants, price_list=price_list
        )

    def _get_cheapest_variant(self, product):
        """
        Return the cheapest variant of the given product, or None if there are no variants.
        Price list is taken from self.context.
        """
        variant_prices = self._get_variant_prices(product)
        return variant_prices.order_by("price").first()

    def get_price(self, product):
        cheapest_variant = self._get_cheapest_variant(product)
        return (
            cheapest_variant.formatted_price if cheapest_variant is not None else None
        )

    def get_has_multiple_prices(self, product):
        cheapest_variant = self._get_cheapest_variant(product)
        if cheapest_variant is None:
            return False
        else:
            return (
                self._get_variant_prices(product)
                .filter(price__gt=cheapest_variant.price)
                .exists()
            )

    class Meta:
        model = Product
        fields = (
            "id",
            "title",
            "meta_title",
            "meta_description",
            "slug",
            "primary_image",
            "price",
            "has_multiple_prices",
        )
