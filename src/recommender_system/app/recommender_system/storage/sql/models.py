from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.sql.sqltypes import Boolean, DECIMAL, Integer, String, TIMESTAMP
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
from recommender_system.models.stored.product_product_variant import (
    ProductProductVariantModel,
)
from recommender_system.models.stored.product_translation import (
    ProductTranslationModel,
)
from recommender_system.models.stored.product_type import ProductTypeModel
from recommender_system.models.stored.product_variant import ProductVariantModel
from recommender_system.storage.sql.base import SQLBase


Base: DeclarativeBase = declarative_base(cls=SQLBase)


class SQLAttribute(Base):
    """
    This model represents product's attribute table in SQL database.
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


class SQLAttributeProductVariant(Base):
    """
    This model represents attribute and product variant relation in SQL
    database.
    """

    id = Column(Integer, primary_key=True)

    attribute_id = Column(Integer, ForeignKey("attribute.id"))
    product_variant_id = Column(String(255), ForeignKey("product_variant.sku"))

    __tablename__ = "attribute_product_variant"

    class Meta:
        origin_model = AttributeProductVariantModel


class SQLAttributeType(Base):
    """
    This model represents product's attribute type table in SQL database.
    """

    id = Column(Integer, primary_key=True)
    type_name = Column(String(200))
    unit = Column(String(200))

    __tablename__ = "attribute_type"

    class Meta:
        origin_model = AttributeTypeModel


class SQLAttributeTypeProductType(Base):
    """
    This model represents attribute type and product type relation in SQL
    database.
    """

    id = Column(Integer, primary_key=True)

    attribute_type_id = Column(Integer, ForeignKey("attribute_type.id"))
    product_type_id = Column(Integer, ForeignKey("product_type.id"))

    __tablename__ = "attribute_type_product_type"

    class Meta:
        origin_model = AttributeTypeProductTypeModel


class SQLProduct(Base):
    """
    This model represents product table in SQL database.
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


class SQLProductProductVariant(Base):
    """
    This model represents product and product variant relation in SQL
    database.
    """

    id = Column(Integer, primary_key=True)

    product_id = Column(Integer, ForeignKey("product.id"))
    product_variant_id = Column(String(255), ForeignKey("product_variant.sku"))

    __tablename__ = "product_product_variant"

    class Meta:
        origin_model = ProductProductVariantModel


class SQLProductTranslation(Base):
    """
    This model represents product translation table in SQL database.
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


class SQLProductType(Base):
    """
    This model represents product type table in SQL database.
    """

    id = Column(Integer, primary_key=True)
    name = Column(String(200))
    update_at = Column(TIMESTAMP)
    create_at = Column(TIMESTAMP)

    __tablename__ = "product_type"

    class Meta:
        origin_model = ProductTypeModel


class SQLProductVariant(Base):
    """
    This model represents product variant table in SQL database.
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
