from core.mixins import (
    TranslatedSerializerMixin,
)
from rest_framework.serializers import (
    ModelSerializer,
    CharField,
    ValidationError,
)
from rest_framework import serializers

from parler_rest.serializers import (
    TranslatableModelSerializer,
    TranslatedFieldsField,
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
    ExtAttributeType,
    ExtensionAttribute,
)

"""
Common serializers
"""


class ProductMediaSerializer(ModelSerializer):
    class Meta:
        model = ProductMedia
        order_by = []
        fields = (
            "id",
            "image",
            "alt",
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


class ProductPriceSerializer(ModelSerializer):
    price_list = PriceListSerializer(read_only=True, many=False)

    class Meta:
        model = ProductPrice
        fields = (
            "id",
            "price",
            "currency",
            "price_list",
        )


"""
Dashboard serializers
"""


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
    prices = ProductPriceSerializer(
        many=True, read_only=False, source="price", required=False
    )

    class Meta:
        model = ProductVariant
        list_serializer_class = ProductVariantListSerializer
        fields = (
            "sku",
            "ean",
            "weight",
            "prices",
            "attributes",
        )

    def validate(self, attrs):
        """
        Validate SKU
        """
        sku = attrs.get("sku", None)
        if not sku:
            raise ValidationError("SKU is required")
        if not sku.isalnum():
            raise ValidationError("SKU can only contain letters and numbers")
        self.instance, created = ProductVariant.objects.get_or_create(sku=sku)

        return attrs

    # overload create method to to save nested prices as well
    # uses update_or_create to update existing SKUs
    def create(self, validated_data):
        prices = validated_data.pop("price", [])
        instance, created = ProductVariant.objects.update_or_create(
            sku=validated_data["sku"], defaults=validated_data
        )
        self.instance = instance

        # print("created", created)
        # for price in prices:
        #     ProductPrice.objects.update_or_create(product_variant=instance, **price)
        return instance

    def update(self, instance, validated_data):
        prices = validated_data.pop("price", [])

        instance = super().update(instance, validated_data)
        # for price in prices:
        #     ProductPrice.objects.update_or_create(product_variant=instance, **price)
        return instance


class ProductDashboardListSerializer(TranslatedSerializerMixin, ModelSerializer):
    """
    Product Dashboard Serializer (see product/models.py)
    returns product fields for dashboard
    """

    primary_image = ProductMediaSerializer(
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
    id = CharField(required=False)  # for update

    # media = ProductMediaSerializer(many=True, read_only=True)
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
        )

    def validate(self, attrs):
        # validate that product variants have unique SKUs
        if "id" in attrs:
            # if id is not present in attrs, it means that we are updating the product
            # in this case we need to check if there are any variants with the same SKU
            # as the product itself
            try:
                self.instance = Product.objects.get(id=attrs["id"])
            except Product.DoesNotExist:
                pass

            del attrs["id"]

        return attrs

    def create(self, validated_data):
        # overload create method to to save nested product_variants as well
        # uses update_or_create to update existing variants
        product_variants_validated_data = validated_data.pop("product_variants", [])

        # create product
        instance, created = Product.objects.get_or_create(**validated_data)

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

        instance.save()

        return instance


class ProductSerializer(TranslatedSerializerMixin, ModelSerializer):
    """
    Basic Product model serializer (see product/models.py)
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
            "slug",
            "product_variants",
        )


class BaseAttributeDashboardSerializer(ModelSerializer):
    class Meta:
        model = BaseAttribute
        fields = (
            "id",
            "value",
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
        )
