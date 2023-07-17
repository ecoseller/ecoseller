import logging
import os
import time

from dependency_injector.wiring import inject, Provide

from recommender_system.managers.trainer import Trainer
from recommender_system.models.stored.model.trainer_queue_item import (
    TrainerQueueItemModel,
)
from recommender_system.server.app import create_app

logging.basicConfig(level=logging.DEBUG)


def run_server() -> None:
    host = os.environ["RS_SERVER_HOST"]
    port = int(os.environ["RS_SERVER_PORT"])
    debug = os.environ.get("RS_SERVER_DEBUG", "False").upper() == "TRUE"

    app = create_app()
    app.run(host=host, port=port, debug=debug, load_dotenv=False)


@inject
def run_trainer(trainer: Trainer = Provide["trainer"]) -> None:
    trainer.init()
    while True:
        trainer.train()
        if TrainerQueueItemModel.get_next_item_from_queue() is None:
            logging.info("waiting")
            time.sleep(60)
