"""empty message

Revision ID: 4a6682478e1f
Revises: 406909cb6289
Create Date: 2023-06-27 20:49:04.970378

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "4a6682478e1f"
down_revision = "406909cb6289"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "prediction_result", sa.Column("create_at", sa.TIMESTAMP(), nullable=False)
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("prediction_result", "create_at")
    # ### end Alembic commands ###
