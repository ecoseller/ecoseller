"""empty message

Revision ID: c7bf2ff5e563
Revises: 39f59c79a1ee
Create Date: 2023-04-23 12:03:28.435743

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "c7bf2ff5e563"
down_revision = "39f59c79a1ee"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "product_variant",
        sa.Column("recommendation_weight", sa.DECIMAL(), nullable=False),
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("product_variant", "recommendation_weight")
    # ### end Alembic commands ###
