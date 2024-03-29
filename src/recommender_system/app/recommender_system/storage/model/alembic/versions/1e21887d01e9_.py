"""empty message

Revision ID: 1e21887d01e9
Revises: 2d418d8853cb
Create Date: 2023-07-02 20:59:31.033808

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "1e21887d01e9"
down_revision = "2d418d8853cb"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("config", sa.Column("gru4rec_config", sa.JSON(), nullable=True))
    op.execute(
        "UPDATE config SET gru4rec_config = '{}'::json WHERE gru4rec_config is NULL"
    )
    op.alter_column("config", "gru4rec_config", nullable=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("config", "gru4rec_config")
    # ### end Alembic commands ###
