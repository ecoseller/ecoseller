"""empty message

Revision ID: 4c35dd4e6637
Revises: 174a0075e044
Create Date: 2023-07-18 11:07:24.430630

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "4c35dd4e6637"
down_revision = "174a0075e044"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("distance", sa.Column("deleted", sa.Boolean(), nullable=True))
    op.execute("UPDATE distance SET deleted = false WHERE deleted is NULL")
    op.alter_column("distance", "deleted", nullable=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("distance", "deleted")
    # ### end Alembic commands ###
