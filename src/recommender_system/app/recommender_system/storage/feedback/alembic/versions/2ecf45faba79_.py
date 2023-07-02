"""empty message

Revision ID: 2ecf45faba79
Revises: 14cacbe2751a
Create Date: 2023-06-29 12:38:36.864802

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "2ecf45faba79"
down_revision = "14cacbe2751a"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("session", sa.Column("create_at", sa.TIMESTAMP(), nullable=True))
    op.execute("UPDATE session SET create_at = now() WHERE create_at is NULL")
    op.alter_column("session", "create_at", nullable=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("session", "create_at")
    # ### end Alembic commands ###
