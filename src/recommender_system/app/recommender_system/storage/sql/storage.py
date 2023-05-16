import argparse
from datetime import datetime
from typing import Any, Dict, List, Optional, Type, Union

from alembic import command, config
from sqlalchemy import create_engine, and_, func, false, true
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Query, Session
from sqlalchemy.orm.exc import NoResultFound, MultipleResultsFound
from sqlalchemy.sql.functions import random

from recommender_system.models.stored.base import StoredBaseModel
from recommender_system.models.stored.many_to_many_relation import (
    ManyToManyRelationMixin,
)
from recommender_system.models.stored.model.trainer_queue_item import (
    TrainerQueueItemModel,
)
from recommender_system.storage.abstract import AbstractStorage
from recommender_system.storage.exceptions import MultipleObjectsReturned
from recommender_system.storage.sql.mapper import SQLModelMapper
from recommender_system.storage.sql.models.feedback import FeedbackBase
from recommender_system.storage.sql.models.model import SQLTrainerQueueItem
from recommender_system.storage.sql.models.products import ProductBase


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
        self, model_class: Type[StoredBaseModel], query: Query, filters: Dict[str, Any]
    ) -> Query:
        sql_class = SQLModelMapper.map(model_class=model_class)

        query_filters = []
        for key, value in filters.items():
            if key == "pks":
                column = getattr(sql_class, model_class.Meta.primary_key)
                query_filters.append(column.in_(value))
            else:
                if key == "pk":
                    column = getattr(sql_class, model_class.Meta.primary_key)
                else:
                    if "__" in key:
                        field, operator = key.split("__")
                        column = getattr(sql_class, field)
                        if operator == "gt":
                            query_filters.append(column > value)
                        elif operator == "gte":
                            query_filters.append(column >= value)
                        elif operator == "lt":
                            query_filters.append(column < value)
                        elif operator == "lte":
                            query_filters.append(column <= value)
                        else:
                            raise ValueError(
                                f"Unknown operator {operator} on field {field}."
                            )
                        continue
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

        return [row[0] for row in query.all()]

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

        return [row[0] for row in query.all()]

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

    def get_next_item_from_trainer_queue(self) -> Optional[TrainerQueueItemModel]:
        query = self.session.query(SQLTrainerQueueItem).select_from(SQLTrainerQueueItem)
        query = query.filter(SQLTrainerQueueItem.processed == false())
        query = query.order_by(SQLTrainerQueueItem.create_at.asc())

        result = query.first()
        if result is None:
            return None

        return TrainerQueueItemModel(**result.__dict__)

    def set_processed(self, model_name: str) -> None:
        self.session.query(SQLTrainerQueueItem).filter(
            SQLTrainerQueueItem.model_name == model_name,
            SQLTrainerQueueItem.processed == false(),
            SQLTrainerQueueItem.create_at <= datetime.now(),
        ).update({SQLTrainerQueueItem.processed: true()})

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

    def delete(self, model_class: Type[StoredBaseModel], **kwargs) -> None:
        sql_class = SQLModelMapper.map(model_class=model_class)

        stmt_filters = []
        for key, value in kwargs.items():
            if key == "pk":
                column = getattr(sql_class, model_class.Meta.primary_key)
            else:
                column = getattr(sql_class, key)
            stmt_filters.append(column == value)

        self.session.query(sql_class).filter(*stmt_filters).delete()
