from sqlalchemy.dialects import postgresql
from sqlalchemy.sql.schema import Column, Index
from sqlalchemy.sql.sqltypes import (
    DECIMAL,
    Integer,
    String,
    TIMESTAMP,
)
from sqlalchemy.orm import declarative_base, DeclarativeBase

from recommender_system.models.stored.feedback.prediction_result import (
    PredictionResultModel,
)
from recommender_system.models.stored.feedback.product_add_to_cart import (
    ProductAddToCartModel,
)
from recommender_system.models.stored.feedback.product_detail_enter import (
    ProductDetailEnterModel,
)
from recommender_system.models.stored.feedback.product_detail_leave import (
    ProductDetailLeaveModel,
)
from recommender_system.models.stored.feedback.recommendation_view import (
    RecommendationViewModel,
)
from recommender_system.models.stored.feedback.review import ReviewModel
from recommender_system.models.stored.feedback.session import SessionModel
from recommender_system.storage.sql.base import SQLFeedbackBase


FeedbackBase: DeclarativeBase = declarative_base(cls=SQLFeedbackBase)


class SQLPredictionResult(FeedbackBase):
    """
    This model represents training statistics table in SQL database.
    """

    id = Column(Integer(), primary_key=True)
    retrieval_model_name = Column(String(255), nullable=False)
    retrieval_model_identifier = Column(String(255), nullable=False)
    scoring_model_name = Column(String(255), nullable=False)
    scoring_model_identifier = Column(String(255), nullable=False)
    recommendation_type = Column(String(255), nullable=False)
    session_id = Column(String(255), nullable=False)
    retrieval_duration = Column(DECIMAL(), nullable=False)
    scoring_duration = Column(DECIMAL(), nullable=False)
    ordering_duration = Column(DECIMAL(), nullable=False)
    predicted_items = Column(postgresql.ARRAY(String(255)), nullable=False)
    create_at = Column(TIMESTAMP(), nullable=False)

    __tablename__ = "prediction_result"

    class Meta:
        origin_model = PredictionResultModel


class SQLProductAddToCart(FeedbackBase):
    """
    This model represents product add to cart table in SQL database.
    """

    id = Column(Integer(), primary_key=True)
    user_id = Column(Integer(), nullable=True)
    product_id = Column(Integer(), nullable=False)
    product_variant_sku = Column(String(255), nullable=False)
    create_at = Column(TIMESTAMP(), nullable=False)

    session_id = Column(String(100), nullable=False)

    __tablename__ = "product_add_to_cart"

    class Meta:
        origin_model = ProductAddToCartModel


class SQLProductDetailEnter(FeedbackBase):
    """
    This model represents product detail view table in SQL database.
    """

    id = Column(Integer(), primary_key=True)
    user_id = Column(Integer(), nullable=True)
    product_id = Column(Integer(), nullable=False)
    product_variant_sku = Column(String(255), nullable=False)
    recommendation_type = Column(String(100), nullable=True)
    model_identifier = Column(String(255), nullable=True)
    model_name = Column(String(255), nullable=True)
    position = Column(Integer(), nullable=True)
    create_at = Column(TIMESTAMP(), nullable=False)

    session_id = Column(String(100), nullable=False)

    __tablename__ = "product_detail_enter"

    __table_args__ = (
        Index("product_detail_enter_session_id_idx", session_id),
        Index("product_detail_enter_create_at_idx", create_at),
    )

    class Meta:
        origin_model = ProductDetailEnterModel


class SQLProductDetailLeave(FeedbackBase):
    """
    This model represents product detail leave table in SQL database.
    """

    id = Column(Integer(), primary_key=True)
    user_id = Column(Integer(), nullable=True)
    product_id = Column(Integer(), nullable=False)
    product_variant_sku = Column(String(255), nullable=False)
    time_spent = Column(DECIMAL(), nullable=False)
    create_at = Column(TIMESTAMP(), nullable=False)

    session_id = Column(String(100), nullable=False)

    __tablename__ = "product_detail_leave"

    class Meta:
        origin_model = ProductDetailLeaveModel


class SQLRecommendationView(FeedbackBase):
    """
    This model represents recommendation view table in SQL database.
    """

    id = Column(Integer(), primary_key=True)
    user_id = Column(Integer(), nullable=True)
    product_id = Column(Integer(), nullable=False)
    product_variant_sku = Column(String(255), nullable=False)
    recommendation_type = Column(String(100), nullable=False)
    model_identifier = Column(String(255), nullable=False)
    position = Column(Integer(), nullable=True)
    create_at = Column(TIMESTAMP(), nullable=False)

    session_id = Column(String(100), nullable=False)

    __tablename__ = "recommendation_view"

    class Meta:
        origin_model = RecommendationViewModel


class SQLReview(FeedbackBase):
    """
    This model represents review table in SQL database.
    """

    id = Column(Integer(), primary_key=True)
    user_id = Column(Integer(), nullable=False)
    product_id = Column(Integer(), nullable=False)
    product_variant_sku = Column(String(255), nullable=False)
    rating = Column(Integer(), nullable=False)
    update_at = Column(TIMESTAMP(), nullable=False)
    create_at = Column(TIMESTAMP(), nullable=False)

    session_id = Column(String(100), nullable=False)

    __tablename__ = "review"

    class Meta:
        origin_model = ReviewModel


class SQLSession(FeedbackBase):
    """
    This model represents session table in SQL database.
    """

    id = Column(String(100), primary_key=True)
    user_id = Column(Integer(), nullable=True)
    visited_product_variants = Column(
        postgresql.ARRAY(String(255)), nullable=False, default=[]
    )

    __tablename__ = "session"

    class Meta:
        origin_model = SessionModel
