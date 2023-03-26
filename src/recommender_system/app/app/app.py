from flask import Flask

from app.container import Container
from server.routes import add_routes


def create_app() -> Flask:
    container = Container()

    app = Flask("Ecoseller-recommender-system")
    app.container = container

    # Adding routes
    add_routes(app=app)

    return app
