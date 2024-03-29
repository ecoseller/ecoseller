"""empty message

Revision ID: 2c77bcef818e
Revises: 004e0d079f5c
Create Date: 2023-07-02 22:21:53.146090

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "2c77bcef818e"
down_revision = "004e0d079f5c"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column("order_product_variant", "amount", new_column_name="quantity")
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column("order_product_variant", "quantity", new_column_name="amount")
    # ### end Alembic commands ###
