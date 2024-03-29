"""empty message

Revision ID: 0fac02b3d7fe
Revises: b9e3cde89b83
Create Date: 2023-05-07 18:40:08.373173

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "0fac02b3d7fe"
down_revision = "b9e3cde89b83"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "latest_identifier",
        sa.Column("model_name", sa.String(length=255), nullable=False),
        sa.Column("identifier", sa.String(length=255), nullable=False),
        sa.PrimaryKeyConstraint("model_name"),
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("latest_identifier")
    # ### end Alembic commands ###
