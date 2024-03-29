import logging
from typing import TYPE_CHECKING

from dependency_injector.wiring import inject, Provide

from recommender_system.models.stored.model.trainer_queue_item import (
    TrainerQueueItemModel,
)

if TYPE_CHECKING:
    from recommender_system.managers.model_manager import ModelManager


class Trainer:
    def schedule_train(self, model_name: str) -> None:
        """
        Adds given model to queue for future training.

        Parameters
        ----------
        model_name : str
            Name of the model to be scheduled for training.

        Returns
        -------
        None
        """
        TrainerQueueItemModel(model_name=model_name).create()

    @inject
    def init(self, model_manager: "ModelManager" = Provide["model_manager"]) -> None:
        """
        Initialize Trainer - schedule trainings of all models.

        Returns
        -------
            None

        """
        for model_name in model_manager.get_all_model_names():
            self.schedule_train(model_name=model_name)

    @inject
    def train(self, model_manager: "ModelManager" = Provide["model_manager"]) -> None:
        """
        Trains the first model in queue.

        Returns
        -------
        None
        """
        queue_item = TrainerQueueItemModel.get_next_item_from_queue()

        if queue_item is None:
            logging.info("No item found in queue. Skipping training.")
            return

        logging.info(f"Training of model {queue_item.model_name} started.")
        queue_item.set_processed()

        model = model_manager.create_model(model_name=queue_item.model_name)
        if not model.is_ready_for_training():
            logging.info(
                f"Skipping training of model {model.Meta.model_name}. Model is not ready."
            )
            return

        model.train()
        model.replace_old()
        logging.info(f"Training of model {queue_item.model_name} finished.")
