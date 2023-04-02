from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.sql.sqltypes import Boolean, DECIMAL, Integer, String, TIMESTAMP
from sqlalchemy.orm import declarative_base, DeclarativeBase

from models.stored.attribute import AttributeModel
from models.stored.attribute_type_product_type import (
    AttributeTypeProductTypeModel,
)
from models.stored.attribute_product_variant import AttributeProductVariantModel
from models.stored.attribute_type import AttributeTypeModel
from models.stored.product import ProductModel
from models.stored.product_product_variant import ProductProductVariantModel
from models.stored.product_translation import ProductTranslationModel
from models.stored.product_type import ProductTypeModel
from models.stored.product_variant import ProductVariantModel
from storage.sqlite.base import SqliteBase


Base: DeclarativeBase = declarative_base(cls=SqliteBase)


class SqliteAttribute(Base):
    """
    This model represents product's attribute table in Sqlite database.
    """

    id = Column(Integer, primary_key=True)
    value = Column(String(200))
    order = Column(Integer, nullable=True)

    attribute_type_id = Column(Integer, ForeignKey("attribute_type.id"))
    parent_attribute_id = Column(
        Integer, ForeignKey("attribute.id"), nullable=True
    )

    __tablename__ = "attribute"

    class Meta:
        origin_model = AttributeModel


class SqliteAttributeProductVariant(Base):
    """
    This model represents attribute and product variant relation in Sqlite
    database.
    """

    id = Column(Integer, primary_key=True)

    attribute_id = Column(Integer, ForeignKey("attribute.id"))
    product_variant_id = Column(Integer, ForeignKey("product_variant.id"))

    __tablename__ = "attribute_product_variant"

    class Meta:
        origin_model = AttributeProductVariantModel


class SqliteAttributeType(Base):
    """
    This model represents product's attribute type table in Sqlite database.
    """

    id = Column(Integer, primary_key=True)
    type_name = Column(String(200))
    unit = Column(String(200))

    __tablename__ = "attribute_type"

    class Meta:
        origin_model = AttributeTypeModel


class SqliteAttributeTypeProductType(Base):
    """
    This model represents attribute type and product type relation in Sqlite
    database.
    """

    id = Column(Integer, primary_key=True)

    attribute_type_id = Column(Integer, ForeignKey("attribute_type.id"))
    product_type_id = Column(Integer, ForeignKey("product_type.id"))

    __tablename__ = "attribute_type_product_type"

    class Meta:
        origin_model = AttributeTypeProductTypeModel


class SqliteProduct(Base):
    """
    This model represents product table in Sqlite database.
    """

    id = Column(Integer, primary_key=True)
    published = Column(Boolean)
    category_id = Column(Integer, nullable=True)
    update_at = Column(TIMESTAMP)
    create_at = Column(TIMESTAMP)

    product_type_id = Column(
        Integer, ForeignKey("product_type.id"), nullable=True
    )

    __tablename__ = "product"

    class Meta:
        origin_model = ProductModel


class SqliteProductProductVariant(Base):
    """
    This model represents product and product variant relation in Sqlite
    database.
    """

    id = Column(Integer, primary_key=True)

    product_id = Column(Integer, ForeignKey("product.id"))
    product_variant_id = Column(Integer, ForeignKey("product_variant.id"))

    __tablename__ = "product_product_variant"

    class Meta:
        origin_model = ProductProductVariantModel


class SqliteProductTranslation(Base):
    """
    This model represents product translation table in Sqlite database.
    """

    id = Column(Integer, primary_key=True)
    language_code = Column(String(10))
    title = Column(String(200))
    meta_title = Column(String(200))
    meta_description = Column(String)
    short_description = Column(String)
    description = Column(String)
    slug = Column(String(200))

    product_id = Column(Integer, ForeignKey("product.id"))

    __tablename__ = "product_translation"

    class Meta:
        origin_model = ProductTranslationModel


class SqliteProductType(Base):
    """
    This model represents product type table in Sqlite database.
    """

    id = Column(Integer, primary_key=True)
    name = Column(String(200))
    update_at = Column(TIMESTAMP)
    create_at = Column(TIMESTAMP)

    __tablename__ = "product_type"

    class Meta:
        origin_model = ProductTypeModel


class SqliteProductVariant(Base):
    """
    This model represents product variant table in Sqlite database.
    """

    sku = Column(String(255), primary_key=True)
    ean = Column(String(13))
    weight = Column(DECIMAL)
    update_at = Column(TIMESTAMP)
    create_at = Column(TIMESTAMP)

    product_id = Column(Integer, ForeignKey("product.id"))

    __tablename__ = "product_variant"

    class Meta:
        origin_model = ProductVariantModel
