"""empty message

Revision ID: 9efb89f84a78
Revises: f365dbaf5d6b
Create Date: 2023-06-27 20:23:20.858934

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "9efb89f84a78"
down_revision = "f365dbaf5d6b"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "prediction_result",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("model_name", sa.String(length=255), nullable=False),
        sa.Column("model_identifier", sa.String(length=255), nullable=False),
        sa.Column("session_id", sa.String(length=255), nullable=False),
        sa.Column("retrieval_duration", sa.DECIMAL(), nullable=False),
        sa.Column("scoring_duration", sa.DECIMAL(), nullable=False),
        sa.Column("ordering_duration", sa.DECIMAL(), nullable=False),
        sa.Column(
            "predicted_items", postgresql.ARRAY(sa.String(length=255)), nullable=False
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("prediction_result")
    # ### end Alembic commands ###
