from abc import ABC
from typing import Tuple, Type

from recommender_system.models.stored.base import StoredBaseModel


class ManyToManyRelationModel(StoredBaseModel, ABC):
    class Meta(StoredBaseModel.Meta):
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

        if source_class == cls.Meta.source_model_class:
            return (
                cls.Meta.target_model_class,
                cls.Meta.source_pk_name,
                cls.Meta.target_pk_name,
            )
        if source_class == cls.Meta.target_model_class:
            return (
                cls.Meta.source_model_class,
                cls.Meta.target_pk_name,
                cls.Meta.source_pk_name,
            )
        raise ValueError(
            f"Unable to get target model class for source class {source_class}"
            " in relation {cls}"
        )
