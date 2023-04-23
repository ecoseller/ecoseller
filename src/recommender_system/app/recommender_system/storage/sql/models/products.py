from sqlalchemy.sql.schema import Column
from sqlalchemy.sql.sqltypes import (
    Boolean,
    DECIMAL,
    Integer,
    String,
    TIMESTAMP,
)
from sqlalchemy.orm import declarative_base, DeclarativeBase

from recommender_system.models.stored.attribute import AttributeModel
from recommender_system.models.stored.attribute_type_product_type import (
    AttributeTypeProductTypeModel,
)
from recommender_system.models.stored.attribute_product_variant import (
    AttributeProductVariantModel,
)
from recommender_system.models.stored.attribute_type import AttributeTypeModel
from recommender_system.models.stored.product import ProductModel
from recommender_system.models.stored.product_price import ProductPriceModel
from recommender_system.models.stored.product_product_variant import (
    ProductProductVariantModel,
)
from recommender_system.models.stored.product_translation import (
    ProductTranslationModel,
)
from recommender_system.models.stored.product_type import ProductTypeModel
from recommender_system.models.stored.product_variant import (
    ProductVariantModel,
)
from recommender_system.storage.sql.base import SQLProductBase


ProductBase: DeclarativeBase = declarative_base(cls=SQLProductBase)


class SQLAttribute(ProductBase):
    """
    This model represents product's attribute table in SQL database.
    """

    id = Column(Integer(), primary_key=True)
    value = Column(String(200), nullable=True)
    order = Column(Integer(), nullable=True)

    attribute_type_id = Column(Integer(), nullable=False)
    parent_attribute_id = Column(Integer(), nullable=True)

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

    __tablename__ = "attribute_product_variant"

    class Meta:
        origin_model = AttributeProductVariantModel


class SQLAttributeType(ProductBase):
    """
    This model represents product's attribute type table in SQL database.
    """

    id = Column(Integer(), primary_key=True)
    type_name = Column(String(200), nullable=True)
    unit = Column(String(200), nullable=True)

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

    __tablename__ = "attribute_type_product_type"

    class Meta:
        origin_model = AttributeTypeProductTypeModel


class SQLProduct(ProductBase):
    """
    This model represents product table in SQL database.
    """

    id = Column(Integer(), primary_key=True)
    published = Column(Boolean(), nullable=False)
    category_id = Column(Integer(), nullable=True)
    update_at = Column(TIMESTAMP(), nullable=False)
    create_at = Column(TIMESTAMP(), nullable=False)

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
    recommendation_weight = Column(DECIMAL(), nullable=False)
    update_at = Column(TIMESTAMP(), nullable=False)
    create_at = Column(TIMESTAMP(), nullable=False)

    __tablename__ = "product_variant"

    class Meta:
        origin_model = ProductVariantModel
