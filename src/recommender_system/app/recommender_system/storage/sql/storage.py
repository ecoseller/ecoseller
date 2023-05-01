import argparse
from typing import Any, Dict, List, Optional, Type, Union

from alembic import command, config
from sqlalchemy import create_engine, and_, func, case
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Query, Session
from sqlalchemy.orm.exc import NoResultFound, MultipleResultsFound
from sqlalchemy.sql.functions import random

from recommender_system.models.stored.base import StoredBaseModel
from recommender_system.models.stored.many_to_many_relation import (
    ManyToManyRelationMixin,
)
from recommender_system.storage.abstract import AbstractStorage
from recommender_system.storage.exceptions import MultipleObjectsReturned
from recommender_system.storage.sql.mapper import SQLModelMapper
from recommender_system.storage.sql.models.feedback import FeedbackBase
from recommender_system.storage.sql.models.products import (
    ProductBase,
    SQLOrderProductVariant,
    SQLProductVariant,
)


Base = Union[Type[ProductBase], Type[FeedbackBase]]


class SQLStorage(AbstractStorage):
    _connection_string: str
    _alembic_location: str

    def __init__(self, connection_string: str, alembic_location: str):
        self._connection_string = connection_string
        self._alembic_location = alembic_location
        self.engine = create_engine(
            url=connection_string,
            isolation_level="AUTOCOMMIT",
        )
        self.session = Session(self.engine)

    def makemigrations(self) -> None:
        args = argparse.Namespace(db_url=self._connection_string)
        conf = config.Config(self._alembic_location, cmd_opts=args)
        command.revision(conf, autogenerate=True)

    def mergemigrations(self) -> None:
        args = argparse.Namespace(db_url=self._connection_string)
        conf = config.Config(self._alembic_location, cmd_opts=args)
        command.merge(conf, "heads")

    def migrate(self) -> None:
        args = argparse.Namespace(db_url=self._connection_string)
        conf = config.Config(self._alembic_location, cmd_opts=args)
        command.upgrade(conf, "heads")

    def _filter(
        self, model_class: Type[Base], query: Query, filters: Dict[str, Any]
    ) -> Query:
        sql_class = SQLModelMapper.map(model_class=model_class)

        query_filters = []
        for key, value in filters.items():
            if key == "pk":
                column = getattr(sql_class, model_class.Meta.primary_key)
            else:
                column = getattr(sql_class, key)
            query_filters.append(column == value)

        return query.filter(*query_filters)

    def get_object(
        self, model_class: Type[StoredBaseModel], **kwargs
    ) -> StoredBaseModel:
        sql_class = SQLModelMapper.map(model_class=model_class)

        query = self.session.query(sql_class)
        query = self._filter(model_class=model_class, query=query, filters=kwargs)

        try:
            result = query.one()
        except NoResultFound:
            raise model_class.DoesNotExist()
        except MultipleResultsFound:
            raise MultipleObjectsReturned()

        return model_class(**result.__dict__)

    def get_objects(
        self, model_class: Type[StoredBaseModel], **kwargs
    ) -> List[StoredBaseModel]:
        sql_class = SQLModelMapper.map(model_class=model_class)

        query = self.session.query(sql_class)
        query = self._filter(model_class=model_class, query=query, filters=kwargs)

        results = query.all()

        models = []
        for result in results:
            models.append(model_class(**result.__dict__))

        return models

    def count_objects(
        self, model_class: Type[StoredBaseModel], **kwargs
    ) -> List[StoredBaseModel]:
        sql_class = SQLModelMapper.map(model_class=model_class)

        pk = getattr(sql_class, model_class.Meta.primary_key)
        query = self.session.query(func.count(pk))
        query = self._filter(model_class=model_class, query=query, filters=kwargs)

        return query.scalar()

    def get_next_pk(self, model_class: Type[StoredBaseModel]) -> int:
        sql_class = SQLModelMapper.map(model_class=model_class)

        current_max = self.session.query(
            func.max(getattr(sql_class, model_class.Meta.primary_key))
        ).scalar()

        return current_max + 1 if current_max is not None else 1

    def get_objects_attribute(
        self,
        model_class: Type[StoredBaseModel],
        attribute: str,
        limit: Optional[int] = None,
        **kwargs,
    ) -> List[Any]:
        sql_class = SQLModelMapper.map(model_class=model_class)

        query = self.session.query(getattr(sql_class, attribute))
        query = self._filter(model_class=model_class, query=query, filters=kwargs)
        if limit is not None:
            query = query.limit(limit)

        return list(map(lambda row: row[0], query.all()))

    def get_random_weighted_attribute(
        self,
        model_class: Type[StoredBaseModel],
        attribute: str,
        weight: str,
        limit: Optional[int] = None,
        **kwargs,
    ) -> List[Any]:
        sql_class = SQLModelMapper.map(model_class=model_class)

        priority = random() * getattr(sql_class, weight)

        query = self.session.query(getattr(sql_class, attribute), priority)
        query = self._filter(model_class=model_class, query=query, filters=kwargs)
        query = query.order_by(priority.desc())
        if limit is not None:
            query = query.limit(limit)

        return list(map(lambda row: row[0], query.all()))

    def get_related_objects(
        self,
        model: StoredBaseModel,
        relation_model_class: Type[ManyToManyRelationMixin],
    ) -> List[StoredBaseModel]:
        (
            target_class,
            source_pk_name,
            target_pk_name,
        ) = relation_model_class.get_target_model_class(source_class=model.__class__)
        sql_target_class = SQLModelMapper.map(model_class=target_class)
        sql_relation_model_class = SQLModelMapper.map(model_class=relation_model_class)

        relation_target_pk_column = getattr(sql_relation_model_class, target_pk_name)
        relation_source_pk_column = getattr(sql_relation_model_class, source_pk_name)
        target_pk_column = getattr(sql_target_class, target_class.Meta.primary_key)

        results = (
            self.session.query(sql_target_class)
            .select_from(sql_target_class)
            .join(
                sql_relation_model_class,
                and_(
                    relation_target_pk_column == target_pk_column,
                    relation_source_pk_column == model.pk,
                ),
            )
            .all()
        )

        models = []
        for result in results:
            models.append(target_class(**result.__dict__))

        return models

    def get_popular_product_variant_pks(self, limit: Optional[int] = None) -> List[Any]:
        amount = case(
            (
                SQLOrderProductVariant.product_variant_sku.isnot(None),
                SQLOrderProductVariant.amount,
            ),
            else_=0,
        ).label("amount")

        number_of_orders = (
            self.session.query(
                SQLProductVariant.sku,
                amount,
            )
            .select_from(SQLProductVariant)
            .outerjoin(
                SQLOrderProductVariant,
                SQLOrderProductVariant.product_variant_sku == SQLProductVariant.sku,
            )
            .subquery()
        )

        priority = func.sum(random() * number_of_orders.c.amount)

        query = (
            self.session.query(SQLProductVariant.sku, priority)
            .select_from(SQLProductVariant)
            .join(
                number_of_orders,
                number_of_orders.c.sku == SQLProductVariant.sku,
            )
            .group_by(SQLProductVariant.sku)
        )
        query = query.order_by(priority.desc())
        if limit is not None:
            query = query.limit(limit)

        return list(map(lambda row: row[0], query.all()))

    def store_object(self, model: StoredBaseModel, create: bool = False) -> Any:
        sql_class = SQLModelMapper.map(model.__class__)
        pk_column = getattr(sql_class, model.Meta.primary_key)
        values = model.dict()
        if getattr(model, model.Meta.primary_key) is None:
            values.pop(model.Meta.primary_key)
        query = insert(sql_class).values(values)
        if create is False:
            update_set = {
                c.key: getattr(query.excluded, c.key) for c in sql_class.__table__.c
            }
            update_set.pop(model.Meta.primary_key)
            query = query.on_conflict_do_update(
                constraint=f"{sql_class.__tablename__}_pkey",
                set_=update_set,
            )
        result = self.session.execute(query.returning(pk_column))
        return result.fetchone()[0]

    def bulk_create_objects(self, models: List[StoredBaseModel]) -> None:
        if len(models) == 0:
            return
        sql_class = SQLModelMapper.map(models[0].__class__)
        data = [model.dict() for model in models]
        self.session.execute(insert(sql_class), data)

    def refresh_object(self, model: StoredBaseModel) -> None:
        result = self.get_object(model_class=model.__class__, pk=model.pk)
        for attr_name, new_value in result.__dict__.items():
            try:
                setattr(model, attr_name, new_value)
            except ValueError:
                pass

    def delete_object(self, model: StoredBaseModel) -> None:
        sql_class = SQLModelMapper.map(model.__class__)
        self.session.query(sql_class).filter(
            getattr(sql_class, model.Meta.primary_key) == model.pk
        ).delete()
