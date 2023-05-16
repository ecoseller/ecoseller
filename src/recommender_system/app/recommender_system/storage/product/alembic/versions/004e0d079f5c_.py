"""empty message

Revision ID: 004e0d079f5c
Revises: 36d6eacc5123
Create Date: 2023-05-16 09:20:21.306432

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "004e0d079f5c"
down_revision = "36d6eacc5123"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "product_variant", sa.Column("stock_quantity", sa.Integer(), nullable=False)
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("product_variant", "stock_quantity")
    # ### end Alembic commands ###
