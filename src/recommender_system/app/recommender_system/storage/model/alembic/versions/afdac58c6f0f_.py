"""empty message

Revision ID: afdac58c6f0f
Revises: 4a6682478e1f
Create Date: 2023-06-28 10:08:21.695003

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "afdac58c6f0f"
down_revision = "4a6682478e1f"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("prediction_result")
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "prediction_result",
        sa.Column("id", sa.INTEGER(), autoincrement=True, nullable=False),
        sa.Column(
            "session_id", sa.VARCHAR(length=255), autoincrement=False, nullable=False
        ),
        sa.Column(
            "retrieval_duration", sa.NUMERIC(), autoincrement=False, nullable=False
        ),
        sa.Column(
            "scoring_duration", sa.NUMERIC(), autoincrement=False, nullable=False
        ),
        sa.Column(
            "ordering_duration", sa.NUMERIC(), autoincrement=False, nullable=False
        ),
        sa.Column(
            "predicted_items",
            postgresql.ARRAY(sa.VARCHAR(length=255)),
            autoincrement=False,
            nullable=False,
        ),
        sa.Column(
            "retrieval_model_name",
            sa.VARCHAR(length=255),
            autoincrement=False,
            nullable=False,
        ),
        sa.Column(
            "retrieval_model_identifier",
            sa.VARCHAR(length=255),
            autoincrement=False,
            nullable=False,
        ),
        sa.Column(
            "scoring_model_name",
            sa.VARCHAR(length=255),
            autoincrement=False,
            nullable=False,
        ),
        sa.Column(
            "scoring_model_identifier",
            sa.VARCHAR(length=255),
            autoincrement=False,
            nullable=False,
        ),
        sa.Column(
            "create_at", postgresql.TIMESTAMP(), autoincrement=False, nullable=False
        ),
        sa.PrimaryKeyConstraint("id", name="prediction_result_pkey"),
    )
    # ### end Alembic commands ###
