import argparse
import os
from typing import Any, Dict, List, Type

from alembic import command, config
from sqlalchemy import create_engine, insert, update, and_
from sqlalchemy.orm import Query, Session
from sqlalchemy.orm.exc import NoResultFound, MultipleResultsFound

from models.stored.base import StoredBaseModel
from models.stored.many_to_many_relation import ManyToManyRelationModel
from storage import ModelNotFoundException, MultipleModelsFoundException
from storage.abstract import AbstractStorage
from storage.sqlite.mapper import SqliteModelMapper
from storage.sqlite.models import Base


class SqliteStorage(AbstractStorage):
    _connection_string: str

    def __init__(self, connection_string: str):
        self._connection_string = connection_string
        self.engine = create_engine(
            url=connection_string,
            isolation_level="AUTOCOMMIT",
        )
        self.session = Session(self.engine)

    def makemigrations(self) -> None:
        args = argparse.Namespace(db_url=self._connection_string)
        conf = config.Config("storage/alembic.ini", cmd_opts=args)
        command.revision(conf, autogenerate=True)

    def mergemigrations(self) -> None:
        args = argparse.Namespace(db_url=self._connection_string)
        conf = config.Config("storage/alembic.ini", cmd_opts=args)
        command.merge(conf, "heads")

    def migrate(self) -> None:
        args = argparse.Namespace(db_url=self._connection_string)
        conf = config.Config("storage/alembic.ini", cmd_opts=args)
        command.upgrade(conf, "heads")

    def _filter(
        self, model_class: Type[Base], query: Query, filters: Dict[str, Any]
    ) -> Query:
        sqlite_class = SqliteModelMapper.map(model_class=model_class)

        query_filters = []
        for key, value in filters.items():
            if key == "pk":
                column = getattr(sqlite_class, model_class.Meta.primary_key)
            else:
                column = getattr(sqlite_class, key)
            query_filters.append(column == value)

        return query.filter(*filters)

    def get_object(
        self, model_class: Type[StoredBaseModel], **kwargs
    ) -> StoredBaseModel:
        sqlite_class = SqliteModelMapper.map(model_class)

        query = self.session.query(sqlite_class)
        query = self._filter(
            model_class=model_class, query=query, filters=kwargs
        )

        try:
            result = query.one()
        except NoResultFound:
            raise ModelNotFoundException()
        except MultipleResultsFound:
            raise MultipleModelsFoundException()

        return model_class(**result.__dict__)

    def get_objects(
        self, model_class: Type[StoredBaseModel], **kwargs
    ) -> List[StoredBaseModel]:
        sqlite_class = SqliteModelMapper.map(model_class)

        query = self.session.query(sqlite_class)
        query = self._filter(
            model_class=model_class, query=query, filters=kwargs
        )

        results = query.all()

        models = []
        for result in results:
            models.append(model_class(**result.__dict__))

        return models

    def get_related_objects(
        self,
        model: StoredBaseModel,
        relation_model_class: Type[ManyToManyRelationModel],
    ) -> List[StoredBaseModel]:
        (
            target_class,
            source_pk_name,
            target_pk_name,
        ) = relation_model_class.get_target_model_class(
            source_class=model.__class__
        )
        sqlite_target_class = SqliteModelMapper.map(model_class=target_class)
        sqlite_relation_model_class = SqliteModelMapper.map(
            model_class=relation_model_class
        )

        relation_target_pk_column = getattr(
            sqlite_relation_model_class, target_pk_name
        )
        relation_source_pk_column = getattr(
            sqlite_relation_model_class, source_pk_name
        )
        target_pk_column = getattr(
            sqlite_target_class, target_class.Meta.primary_key
        )

        results = (
            self.session.query(sqlite_target_class)
            .select_from(sqlite_target_class)
            .join(
                sqlite_relation_model_class,
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

    def create_object(self, model: StoredBaseModel) -> None:
        sqlite_class = SqliteModelMapper.map(model.__class__)
        stmt = insert(sqlite_class).values(model.dict())
        self.session.execute(stmt)

    def update_object(self, model: StoredBaseModel) -> None:
        sqlite_class = SqliteModelMapper.map(model.__class__)
        stmt = (
            update(sqlite_class)
            .where(sqlite_class.__pk__ == model.pk)
            .values(model.dict())
        )
        self.session.execute(stmt)

    def refresh_object(self, model: StoredBaseModel) -> None:
        result = self.get_object(model_class=model.__class__, pk=model.pk)
        for attr_name, new_value in result.__dict__.items():
            try:
                setattr(model, attr_name, new_value)
            except ValueError:
                pass

    def delete_object(self, model: StoredBaseModel) -> None:
        sqlite_class = SqliteModelMapper.map(model.__class__)
        self.session.query(sqlite_class).filter(
            getattr(sqlite_class, model.Meta.primary_key) == model.pk
        ).delete()
