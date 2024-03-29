"""empty message

Revision ID: 406909cb6289
Revises: 9efb89f84a78
Create Date: 2023-06-27 20:25:34.767087

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "406909cb6289"
down_revision = "9efb89f84a78"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "prediction_result",
        sa.Column("retrieval_model_name", sa.String(length=255), nullable=False),
    )
    op.add_column(
        "prediction_result",
        sa.Column("retrieval_model_identifier", sa.String(length=255), nullable=False),
    )
    op.add_column(
        "prediction_result",
        sa.Column("scoring_model_name", sa.String(length=255), nullable=False),
    )
    op.add_column(
        "prediction_result",
        sa.Column("scoring_model_identifier", sa.String(length=255), nullable=False),
    )
    op.drop_column("prediction_result", "model_name")
    op.drop_column("prediction_result", "model_identifier")
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "prediction_result",
        sa.Column(
            "model_identifier",
            sa.VARCHAR(length=255),
            autoincrement=False,
            nullable=False,
        ),
    )
    op.add_column(
        "prediction_result",
        sa.Column(
            "model_name", sa.VARCHAR(length=255), autoincrement=False, nullable=False
        ),
    )
    op.drop_column("prediction_result", "scoring_model_identifier")
    op.drop_column("prediction_result", "scoring_model_name")
    op.drop_column("prediction_result", "retrieval_model_identifier")
    op.drop_column("prediction_result", "retrieval_model_name")
    # ### end Alembic commands ###
