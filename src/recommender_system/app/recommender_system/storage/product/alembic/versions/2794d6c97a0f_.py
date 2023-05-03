"""empty message

Revision ID: 2794d6c97a0f
Revises: e2c5c496c6f4
Create Date: 2023-04-30 15:08:15.472259

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "2794d6c97a0f"
down_revision = "e2c5c496c6f4"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "attribute_type",
        sa.Column(
            "type", sa.String(length=100), server_default="CATEGORICAL", nullable=False
        ),
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("attribute_type", "type")
    # ### end Alembic commands ###