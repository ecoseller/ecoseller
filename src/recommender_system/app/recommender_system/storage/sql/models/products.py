from sqlalchemy.sql.schema import Column
from sqlalchemy.sql.sqltypes import Boolean, DECIMAL, Integer, String, TIMESTAMP, UUID
from sqlalchemy.orm import declarative_base, DeclarativeBase

from recommender_system.models.stored.product.attribute import AttributeModel
from recommender_system.models.stored.product.attribute_type_product_type import (
    AttributeTypeProductTypeModel,
)
from recommender_system.models.stored.product.attribute_product_variant import (
    AttributeProductVariantModel,
)
from recommender_system.models.stored.product.attribute_type import AttributeTypeModel
from recommender_system.models.stored.product.category_ancestor import (
    CategoryAncestorModel,
)
from recommender_system.models.stored.product.order import OrderModel
from recommender_system.models.stored.product.order_product_variant import (
    OrderProductVariantModel,
)
from recommender_system.models.stored.product.product import ProductModel
from recommender_system.models.stored.product.product_price import ProductPriceModel
from recommender_system.models.stored.product.product_product_variant import (
    ProductProductVariantModel,
)
from recommender_system.models.stored.product.product_translation import (
    ProductTranslationModel,
)
from recommender_system.models.stored.product.product_type import ProductTypeModel
from recommender_system.models.stored.product.product_variant import (
    ProductVariantModel,
)
from recommender_system.storage.sql.base import SQLProductBase


ProductBase: DeclarativeBase = declarative_base(cls=SQLProductBase)


class SQLAttribute(ProductBase):
    """
    This model represents product's attribute table in SQL database.
    """

    id = Column(Integer(), primary_key=True)
    raw_value = Column(String(200), nullable=True)
    numeric_value = Column(DECIMAL(), nullable=True)
    order = Column(Integer(), nullable=True)

    attribute_type_id = Column(Integer(), nullable=False)
    parent_attribute_id = Column(Integer(), nullable=True)
    deleted = Column(Boolean(), nullable=False)

    __tablename__ = "attribute"

    class Meta:
        origin_model = AttributeModel


class SQLAttributeProductVariant(ProductBase):
    """
    This model represents attribute and product variant relation in SQL
    database.
    """

    id = Column(Integer(), primary_key=True)

    attribute_id = Column(Integer(), nullable=False)
    product_variant_sku = Column(String(255), nullable=False)
    deleted = Column(Boolean(), nullable=False)

    __tablename__ = "attribute_product_variant"

    class Meta:
        origin_model = AttributeProductVariantModel


class SQLAttributeType(ProductBase):
    """
    This model represents product's attribute type table in SQL database.
    """

    id = Column(Integer(), primary_key=True)
    type = Column(
        String(100),
        nullable=False,
        server_default=AttributeTypeModel.Type.get_default(),
    )
    type_name = Column(String(200), nullable=True)
    unit = Column(String(200), nullable=True)
    deleted = Column(Boolean(), nullable=False)

    __tablename__ = "attribute_type"

    class Meta:
        origin_model = AttributeTypeModel


class SQLAttributeTypeProductType(ProductBase):
    """
    This model represents attribute type and product type relation in SQL
    database.
    """

    id = Column(Integer(), primary_key=True)

    attribute_type_id = Column(Integer(), nullable=False)
    product_type_id = Column(Integer(), nullable=False)
    deleted = Column(Boolean(), nullable=False)

    __tablename__ = "attribute_type_product_type"

    class Meta:
        origin_model = AttributeTypeProductTypeModel


class SQLCategoryAncestor(ProductBase):
    """
    This model represents category and its ancestor relation in SQL database.
    """

    id = Column(Integer(), primary_key=True)

    category_id = Column(Integer(), nullable=False)
    category_ancestor_id = Column(Integer(), nullable=False)
    deleted = Column(Boolean(), nullable=False)

    __tablename__ = "category_ancestor"

    class Meta:
        origin_model = CategoryAncestorModel


class SQLOrder(ProductBase):
    """
    This model represents order table in SQL database.
    """

    token = Column(UUID(as_uuid=True), primary_key=True)
    update_at = Column(TIMESTAMP(), nullable=False)
    create_at = Column(TIMESTAMP(), nullable=False)
    deleted = Column(Boolean(), nullable=False)

    session_id = Column(String(100), nullable=False)

    __tablename__ = "order"

    class Meta:
        origin_model = OrderModel


class SQLOrderProductVariant(ProductBase):
    """
    This model represents order and product variant relation in SQL database.
    """

    id = Column(Integer(), primary_key=True)
    quantity = Column(Integer(), nullable=False)

    order_token = Column(UUID(as_uuid=True), nullable=False)
    product_variant_sku = Column(String(255), nullable=False)
    deleted = Column(Boolean(), nullable=False)

    __tablename__ = "order_product_variant"

    class Meta:
        origin_model = OrderProductVariantModel


class SQLProduct(ProductBase):
    """
    This model represents product table in SQL database.
    """

    id = Column(Integer(), primary_key=True)
    published = Column(Boolean(), nullable=False)
    category_id = Column(Integer(), nullable=True)
    update_at = Column(TIMESTAMP(), nullable=False)
    create_at = Column(TIMESTAMP(), nullable=False)
    deleted = Column(Boolean(), nullable=False)

    product_type_id = Column(Integer(), nullable=True)

    __tablename__ = "product"

    class Meta:
        origin_model = ProductModel


class SQLProductPrice(ProductBase):
    """
    This model represents product price table in SQL database.
    """

    id = Column(Integer(), primary_key=True)
    price_list_code = Column(String(200), nullable=False)
    price = Column(DECIMAL(), nullable=False)
    update_at = Column(TIMESTAMP(), nullable=False)
    create_at = Column(TIMESTAMP(), nullable=False)
    deleted = Column(Boolean(), nullable=False)

    product_variant_sku = Column(String(255), nullable=True)

    __tablename__ = "product_price"

    class Meta:
        origin_model = ProductPriceModel


class SQLProductProductVariant(ProductBase):
    """
    This model represents product and product variant relation in SQL
    database.
    """

    id = Column(Integer(), primary_key=True)

    product_id = Column(Integer(), nullable=False)
    product_variant_sku = Column(String(255), nullable=False)
    deleted = Column(Boolean(), nullable=False)

    __tablename__ = "product_product_variant"

    class Meta:
        origin_model = ProductProductVariantModel


class SQLProductTranslation(ProductBase):
    """
    This model represents product translation table in SQL database.
    """

    id = Column(Integer(), primary_key=True)
    language_code = Column(String(10), nullable=False)
    title = Column(String(200), nullable=False)
    meta_title = Column(String(200), nullable=False)
    meta_description = Column(String(), nullable=False)
    short_description = Column(String(), nullable=True)
    description = Column(String(), nullable=True)
    slug = Column(String(200), nullable=False)
    deleted = Column(Boolean(), nullable=False)

    product_id = Column(Integer(), nullable=False)

    __tablename__ = "product_translation"

    class Meta:
        origin_model = ProductTranslationModel


class SQLProductType(ProductBase):
    """
    This model represents product type table in SQL database.
    """

    id = Column(Integer(), primary_key=True)
    name = Column(String(200), nullable=False)
    update_at = Column(TIMESTAMP(), nullable=False)
    create_at = Column(TIMESTAMP(), nullable=False)
    deleted = Column(Boolean(), nullable=False)

    __tablename__ = "product_type"

    class Meta:
        origin_model = ProductTypeModel


class SQLProductVariant(ProductBase):
    """
    This model represents product variant table in SQL database.
    """

    sku = Column(String(255), primary_key=True)
    ean = Column(String(13), nullable=False)
    weight = Column(DECIMAL(), nullable=True)
    stock_quantity = Column(Integer(), nullable=False)
    recommendation_weight = Column(DECIMAL(), nullable=False)
    update_at = Column(TIMESTAMP(), nullable=False)
    create_at = Column(TIMESTAMP(), nullable=False)
    deleted = Column(Boolean(), nullable=False)

    __tablename__ = "product_variant"

    class Meta:
        origin_model = ProductVariantModel
