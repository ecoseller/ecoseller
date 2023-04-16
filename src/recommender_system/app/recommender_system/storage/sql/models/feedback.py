from sqlalchemy.sql.schema import Column
from sqlalchemy.sql.sqltypes import (
    Float,
    Integer,
    String,
    TIMESTAMP,
)
from sqlalchemy.orm import declarative_base, DeclarativeBase

from recommender_system.models.stored.product_added_to_cart import (
    ProductAddedToCartModel,
)
from recommender_system.models.stored.product_detail_enter import (
    ProductDetailEnterModel,
)
from recommender_system.models.stored.product_detail_leave import (
    ProductDetailLeaveModel,
)
from recommender_system.models.stored.recommendation_view import RecommendationViewModel
from recommender_system.models.stored.review import ReviewModel
from recommender_system.storage.sql.base import SQLFeedbackBase


FeedbackBase: DeclarativeBase = declarative_base(cls=SQLFeedbackBase)


class SQLProductAddedToCart(FeedbackBase):
    """
    This model represents product added to cart table in SQL database.
    """

    id = Column(Integer(), primary_key=True)
    session_id = Column(String(100))
    user_id = Column(Integer(), nullable=True)
    product_id = Column(Integer())
    create_at = Column(TIMESTAMP())

    __tablename__ = "product_added_to_cart"

    class Meta:
        origin_model = ProductAddedToCartModel


class SQLProductDetailEnter(FeedbackBase):
    """
    This model represents product detail view table in SQL database.
    """

    id = Column(Integer(), primary_key=True)
    session_id = Column(String(100))
    user_id = Column(Integer(), nullable=True)
    product_id = Column(Integer())
    recommendation_type = Column(String(100), nullable=True)
    position = Column(Integer(), nullable=True)
    create_at = Column(TIMESTAMP())

    __tablename__ = "product_detail_enter"

    class Meta:
        origin_model = ProductDetailEnterModel


class SQLProductDetailLeave(FeedbackBase):
    """
    This model represents product detail leave table in SQL database.
    """

    id = Column(Integer(), primary_key=True)
    session_id = Column(String(100))
    user_id = Column(Integer(), nullable=True)
    product_id = Column(Integer())
    time_spent = Column(Float())
    create_at = Column(TIMESTAMP())

    __tablename__ = "product_detail_leave"

    class Meta:
        origin_model = ProductDetailLeaveModel


class SQLRecommendationView(FeedbackBase):
    """
    This model represents recommendation view table in SQL database.
    """

    id = Column(Integer(), primary_key=True)
    session_id = Column(String(100))
    user_id = Column(Integer(), nullable=True)
    product_id = Column(Integer())
    recommendation_type = Column(String(100))
    position = Column(Integer(), nullable=True)
    create_at = Column(TIMESTAMP())

    __tablename__ = "recommendation_view"

    class Meta:
        origin_model = RecommendationViewModel


class SQLReview(FeedbackBase):
    """
    This model represents review table in SQL database.
    """

    id = Column(Integer(), primary_key=True)
    session_id = Column(String(100))
    user_id = Column(Integer())
    product_id = Column(Integer())
    rating = Column(Integer())
    update_at = Column(TIMESTAMP())
    create_at = Column(TIMESTAMP())

    __tablename__ = "review"

    class Meta:
        origin_model = ReviewModel
