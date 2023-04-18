"""empty message

Revision ID: 9134449c5629
Revises: 
Create Date: 2023-04-16 22:04:13.393678

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "9134449c5629"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "session",
        sa.Column("id", sa.String(length=100), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "product_add_to_cart",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=True),
        sa.Column("product_id", sa.Integer(), nullable=True),
        sa.Column("create_at", sa.TIMESTAMP(), nullable=True),
        sa.Column("session_id", sa.String(length=100), nullable=True),
        sa.ForeignKeyConstraint(
            ["session_id"],
            ["session.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "product_detail_enter",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=True),
        sa.Column("product_id", sa.Integer(), nullable=True),
        sa.Column("recommendation_type", sa.String(length=100), nullable=True),
        sa.Column("position", sa.Integer(), nullable=True),
        sa.Column("create_at", sa.TIMESTAMP(), nullable=True),
        sa.Column("session_id", sa.String(length=100), nullable=True),
        sa.ForeignKeyConstraint(
            ["session_id"],
            ["session.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "product_detail_leave",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=True),
        sa.Column("product_id", sa.Integer(), nullable=True),
        sa.Column("time_spent", sa.Float(), nullable=True),
        sa.Column("create_at", sa.TIMESTAMP(), nullable=True),
        sa.Column("session_id", sa.String(length=100), nullable=True),
        sa.ForeignKeyConstraint(
            ["session_id"],
            ["session.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "recommendation_view",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=True),
        sa.Column("product_id", sa.Integer(), nullable=True),
        sa.Column("recommendation_type", sa.String(length=100), nullable=True),
        sa.Column("position", sa.Integer(), nullable=True),
        sa.Column("create_at", sa.TIMESTAMP(), nullable=True),
        sa.Column("session_id", sa.String(length=100), nullable=True),
        sa.ForeignKeyConstraint(
            ["session_id"],
            ["session.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "review",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=True),
        sa.Column("product_id", sa.Integer(), nullable=True),
        sa.Column("rating", sa.Integer(), nullable=True),
        sa.Column("update_at", sa.TIMESTAMP(), nullable=True),
        sa.Column("create_at", sa.TIMESTAMP(), nullable=True),
        sa.Column("session_id", sa.String(length=100), nullable=True),
        sa.ForeignKeyConstraint(
            ["session_id"],
            ["session.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("review")
    op.drop_table("recommendation_view")
    op.drop_table("product_detail_leave")
    op.drop_table("product_detail_enter")
    op.drop_table("product_add_to_cart")
    op.drop_table("session")
    # ### end Alembic commands ###