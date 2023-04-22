"""empty message

Revision ID: ef6b81676342
Revises: af2767c85a4c
Create Date: 2023-04-22 19:24:35.656615

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ef6b81676342'
down_revision = 'af2767c85a4c'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('product_add_to_cart_session_id_fkey', 'product_add_to_cart', type_='foreignkey')
    op.drop_constraint('product_detail_enter_session_id_fkey', 'product_detail_enter', type_='foreignkey')
    op.drop_constraint('product_detail_leave_session_id_fkey', 'product_detail_leave', type_='foreignkey')
    op.drop_constraint('recommendation_view_session_id_fkey', 'recommendation_view', type_='foreignkey')
    op.drop_constraint('review_session_id_fkey', 'review', type_='foreignkey')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_foreign_key('review_session_id_fkey', 'review', 'session', ['session_id'], ['id'])
    op.create_foreign_key('recommendation_view_session_id_fkey', 'recommendation_view', 'session', ['session_id'], ['id'])
    op.create_foreign_key('product_detail_leave_session_id_fkey', 'product_detail_leave', 'session', ['session_id'], ['id'])
    op.create_foreign_key('product_detail_enter_session_id_fkey', 'product_detail_enter', 'session', ['session_id'], ['id'])
    op.create_foreign_key('product_add_to_cart_session_id_fkey', 'product_add_to_cart', 'session', ['session_id'], ['id'])
    # ### end Alembic commands ###
