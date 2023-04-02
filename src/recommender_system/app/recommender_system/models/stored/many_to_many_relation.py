from typing import Tuple, Type

from recommender_system.models.stored.base import StoredBaseModel


class ManyToManyRelationMixin:
    class RelationMeta:
        source_model_class: Type[StoredBaseModel]
        target_model_class: Type[StoredBaseModel]
        source_pk_name: str
        target_pk_name: str

    @classmethod
    def get_target_model_class(
        cls, source_class: Type[StoredBaseModel]
    ) -> Tuple[Type[StoredBaseModel], str, str]:
        """
        Returns target class of this relation, source primary key name and
        target primary key name.
        """

        if source_class == cls.RelationMeta.source_model_class:
            return (
                cls.RelationMeta.target_model_class,
                cls.RelationMeta.source_pk_name,
                cls.RelationMeta.target_pk_name,
            )
        if source_class == cls.RelationMeta.target_model_class:
            return (
                cls.RelationMeta.source_model_class,
                cls.RelationMeta.target_pk_name,
                cls.RelationMeta.source_pk_name,
            )
        raise ValueError(
            f"Unable to get target model class for source class {source_class}"
            " in relation {cls}"
        )
