import logging
import sys

from recommender_system.server.app import create_app


if __name__ == "__main__":
    app = create_app()
    if len(sys.argv) <= 1:
        raise ValueError("Storage not provided!")
    for storage in sys.argv[1:]:
        if not hasattr(app.container, storage):
            logging.error(f"Storage {storage} not found in app!")
            continue
        getattr(app.container, storage)().makemigrations()
