"""empty message

Revision ID: 61283a295aa9
Revises: 9109778cfa26
Create Date: 2023-06-28 10:08:16.572852

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "61283a295aa9"
down_revision = "9109778cfa26"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "prediction_result",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("retrieval_model_name", sa.String(length=255), nullable=False),
        sa.Column("retrieval_model_identifier", sa.String(length=255), nullable=False),
        sa.Column("scoring_model_name", sa.String(length=255), nullable=False),
        sa.Column("scoring_model_identifier", sa.String(length=255), nullable=False),
        sa.Column("session_id", sa.String(length=255), nullable=False),
        sa.Column("retrieval_duration", sa.DECIMAL(), nullable=False),
        sa.Column("scoring_duration", sa.DECIMAL(), nullable=False),
        sa.Column("ordering_duration", sa.DECIMAL(), nullable=False),
        sa.Column(
            "predicted_items", postgresql.ARRAY(sa.String(length=255)), nullable=False
        ),
        sa.Column("create_at", sa.TIMESTAMP(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("prediction_result")
    # ### end Alembic commands ###
