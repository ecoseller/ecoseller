import argparse
from typing import Any, Dict, List, Type

from alembic import command, config
from sqlalchemy import create_engine, insert, update, and_
from sqlalchemy.orm import Query, Session
from sqlalchemy.orm.exc import NoResultFound, MultipleResultsFound

from recommender_system.models.stored.base import StoredBaseModel
from recommender_system.models.stored.many_to_many_relation import (
    ManyToManyRelationMixin,
)
from recommender_system.storage import (
    ModelNotFoundException,
    MultipleModelsFoundException,
)
from recommender_system.storage.abstract import AbstractStorage
from recommender_system.storage.sql.mapper import SQLModelMapper
from recommender_system.storage.sql.models import Base


class SQLStorage(AbstractStorage):
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
        conf = config.Config("recommender_system/storage/alembic.ini", cmd_opts=args)
        command.revision(conf, autogenerate=True)

    def mergemigrations(self) -> None:
        args = argparse.Namespace(db_url=self._connection_string)
        conf = config.Config("recommender_system/storage/alembic.ini", cmd_opts=args)
        command.merge(conf, "heads")

    def migrate(self) -> None:
        args = argparse.Namespace(db_url=self._connection_string)
        conf = config.Config("recommender_system/storage/alembic.ini", cmd_opts=args)
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
        sql_class = SQLModelMapper.map(model_class)

        query = self.session.query(sql_class)
        query = self._filter(model_class=model_class, query=query, filters=kwargs)

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
        sql_class = SQLModelMapper.map(model_class)

        query = self.session.query(sql_class)
        query = self._filter(model_class=model_class, query=query, filters=kwargs)

        results = query.all()

        models = []
        for result in results:
            models.append(model_class(**result.__dict__))

        return models

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

    def store_object(self, model: StoredBaseModel, create: bool = False) -> Any:
        sql_class = SQLModelMapper.map(model.__class__)
        pk_column = getattr(sql_class, model.Meta.primary_key)
        query = update(sql_class).filter(pk_column == model.pk)
        if create:
            query = insert(sql_class)
        query = query.values(model.dict())
        self.session.execute(query)
        inserted_object = (
            self.session.query(sql_class).order_by(pk_column.desc()).first()
        )
        return getattr(inserted_object, model.Meta.primary_key)

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
