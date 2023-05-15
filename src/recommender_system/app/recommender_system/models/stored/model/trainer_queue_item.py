from datetime import datetime
from typing import Optional, TYPE_CHECKING

from dependency_injector.wiring import inject, Provide

from recommender_system.models.stored.model.base import ModelStoredBaseModel

if TYPE_CHECKING:
    from recommender_system.storage.model.abstract import AbstractModelStorage


class TrainerQueueItemModel(ModelStoredBaseModel):
    """
    This model represents item in queue of models to be trained as an object that is stored in the database.
    """

    id: Optional[int]
    model_name: str
    create_at: datetime = datetime.now()
    processed: bool = False

    class Meta:
        primary_key = "id"

    @classmethod
    @inject
    def get_next_item_from_queue(
        cls, storage: "AbstractModelStorage" = Provide["model_storage"]
    ) -> "TrainerQueueItemModel":
        return storage.get_next_item_from_trainer_queue()

    def set_processed(self) -> None:
        self._storage.set_processed(model_name=self.model_name)
