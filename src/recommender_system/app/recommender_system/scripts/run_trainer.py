import logging

from recommender_system.server.container import Container
from recommender_system.server.run import run_trainer

logging.basicConfig(level=logging.DEBUG)


if __name__ == "__main__":
    container = Container()
    container.wire()
    run_trainer()
