from typing import Any, Dict, List, Optional, TYPE_CHECKING

from sqlalchemy import and_, func, case, or_
from sqlalchemy.sql.functions import random

from recommender_system.models.stored.similarity.distance import DistanceModel
from recommender_system.storage.product.abstract import AbstractProductStorage
from recommender_system.storage.product.statistics import NumericalStatistics
from recommender_system.storage.sql.models.products import (
    SQLAttribute,
    SQLAttributeProductVariant,
    SQLCategoryAncestor,
    SQLOrderProductVariant,
    SQLProduct,
    SQLProductProductVariant,
    SQLProductPrice,
    SQLProductVariant,
)
from recommender_system.storage.sql.models.similarity import SQLDistance
from recommender_system.storage.sql.storage import SQLStorage

if TYPE_CHECKING:
    from recommender_system.models.stored.product.product_product_variant import (
        ProductProductVariantModel,
    )


class SQLProductStorage(SQLStorage, AbstractProductStorage):
    def get_popular_product_variant_skus(
        self, filter_in_stock: bool, limit: Optional[int] = None
    ) -> List[str]:
        quantity = case(
            (
                SQLOrderProductVariant.product_variant_sku.isnot(None),
                SQLOrderProductVariant.quantity,
            ),
            else_=0,
        ).label("quantity")

        number_of_orders = (
            self.session.query(
                SQLProductVariant.sku,
                quantity,
            )
            .select_from(SQLProductVariant)
            .outerjoin(
                SQLOrderProductVariant,
                SQLOrderProductVariant.product_variant_sku == SQLProductVariant.sku,
            )
            .subquery()
        )

        priority = func.sum(random() * number_of_orders.c.quantity)

        query = (
            self.session.query(SQLProductVariant.sku, priority)
            .select_from(SQLProductVariant)
            .join(
                number_of_orders,
                number_of_orders.c.sku == SQLProductVariant.sku,
            )
        )
        if filter_in_stock:
            query = query.filter(SQLProductVariant.stock_quantity > 0)
        query = query.group_by(SQLProductVariant.sku)
        query = query.order_by(priority.desc())
        if limit is not None:
            query = query.limit(limit)

        return [row[0] for row in query.all()]

    def get_product_variant_popularities(self, skus: List[str]) -> Dict[str, int]:
        quantity = case(
            (
                SQLOrderProductVariant.product_variant_sku.isnot(None),
                SQLOrderProductVariant.quantity,
            ),
            else_=0,
        ).label("quantity")

        number_of_orders = (
            self.session.query(
                SQLProductVariant.sku,
                quantity,
            )
            .select_from(SQLProductVariant)
            .outerjoin(
                SQLOrderProductVariant,
                SQLOrderProductVariant.product_variant_sku == SQLProductVariant.sku,
            )
            .subquery()
        )

        priority = func.sum(number_of_orders.c.quantity)

        query = (
            self.session.query(SQLProductVariant.sku, priority)
            .select_from(SQLProductVariant)
            .join(
                number_of_orders,
                number_of_orders.c.sku == SQLProductVariant.sku,
            )
            .filter(SQLProductVariant.sku.in_(skus))
            .group_by(SQLProductVariant.sku)
        )

        return {row[0]: row[1] for row in query.all()}

    def get_raw_attribute_values(self, attribute_type_id: int) -> List[str]:
        frequency = func.count(SQLAttribute.id)
        query = self.session.query(SQLAttribute.raw_value, frequency).select_from(
            SQLAttribute
        )
        query = query.filter(SQLAttribute.attribute_type_id == attribute_type_id)
        query = query.group_by(SQLAttribute.raw_value)
        query = query.order_by(frequency.desc())

        return [row[0] for row in query.all()]

    def get_attribute_type_stats(
        self, attribute_type_id: int
    ) -> Optional[NumericalStatistics]:
        query = self.session.query(
            func.min(SQLAttribute.numeric_value),
            func.avg(SQLAttribute.numeric_value),
            func.max(SQLAttribute.numeric_value),
        ).select_from(SQLAttribute)
        query = query.filter(SQLAttribute.attribute_type_id == attribute_type_id)

        result = query.first()
        if result is not None:
            result = NumericalStatistics(min=result[0], avg=result[1], max=result[2])

        return result

    def get_product_variant_attribute_values(
        self, attribute_type_id: int
    ) -> Dict[str, Optional[Any]]:
        from recommender_system.models.stored.product.attribute_type import (
            AttributeTypeModel,
        )

        attribute_type = self.get_object(
            model_class=AttributeTypeModel, pk=attribute_type_id
        )

        if attribute_type.type == AttributeTypeModel.Type.NUMERICAL:
            value_column = SQLAttribute.numeric_value
        else:
            value_column = SQLAttribute.raw_value

        query = self.session.query(
            SQLAttributeProductVariant.product_variant_sku, value_column
        ).select_from(SQLAttributeProductVariant)
        query = query.join(
            SQLAttribute, SQLAttribute.id == SQLAttributeProductVariant.attribute_id
        )
        query = query.filter(SQLAttribute.attribute_type_id == attribute_type_id)

        return {row[0]: row[1] for row in query.all()}

    def get_product_variant_skus_in_category(self, category_id: int) -> List[str]:
        query = self.session.query(SQLProductVariant.sku).select_from(SQLProductVariant)
        query = query.join(
            SQLProductProductVariant,
            SQLProductProductVariant.product_variant_sku == SQLProductVariant.sku,
        )
        query = query.join(
            SQLProduct, SQLProduct.id == SQLProductProductVariant.product_id
        )
        query = query.outerjoin(
            SQLCategoryAncestor,
            SQLCategoryAncestor.category_id == SQLProduct.category_id,
        )
        query = query.filter(
            or_(
                SQLCategoryAncestor.category_ancestor_id == category_id,
                and_(
                    SQLCategoryAncestor.category_id.is_(None),
                    SQLProduct.category_id == category_id,
                ),
            )
        )

        return [row[0] for row in query.all()]

    def get_product_product_variants_in_category(
        self, category_id: int
    ) -> List["ProductProductVariantModel"]:
        from recommender_system.models.stored.product.product_product_variant import (
            ProductProductVariantModel,
        )

        query = self.session.query(SQLProductProductVariant).select_from(
            SQLProductProductVariant
        )
        query = query.join(
            SQLProduct, SQLProduct.id == SQLProductProductVariant.product_id
        )
        query = query.filter(SQLProduct.category_id == category_id)

        result = []
        for row in query.all():
            result.append(ProductProductVariantModel(**row.__dict__))
        return result

    def get_product_variant_prices(self) -> Dict[str, float]:
        query = self.session.query(
            SQLProductPrice.product_variant_sku, SQLProductPrice.price
        )
        query = query.select_from(SQLProductPrice)
        return {row[0]: row[1] for row in query.all()}

    def get_price_stats(self) -> Optional[NumericalStatistics]:
        query = self.session.query(
            func.min(SQLProductPrice.price),
            func.avg(SQLProductPrice.price),
            func.max(SQLProductPrice.price),
        ).select_from(SQLProductPrice)

        result = query.first()
        if result is not None:
            result = NumericalStatistics(min=result[0], avg=result[1], max=result[2])

        return result

    def get_closest_product_variant_skus(
        self, to: str, limit: Optional[int] = None, **kwargs: Any
    ) -> List[str]:
        query = self.session.query(SQLDistance.lhs, SQLDistance.rhs).select_from(
            SQLDistance
        )
        query = query.filter(or_(SQLDistance.lhs == to, SQLDistance.rhs == to))
        query = self._filter(model_class=DistanceModel, query=query, filters=kwargs)
        query = query.order_by(SQLDistance.distance)
        if limit is not None:
            query = query.limit(limit)

        return [row[0] if row[0] != to else row[1] for row in query.all()]
