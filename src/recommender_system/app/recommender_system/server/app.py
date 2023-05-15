from flask import Flask

from recommender_system.server.container import Container
from recommender_system.server.routes import add_routes


def create_app() -> Flask:
    container = Container()
    container.wire()
    app = Flask("Ecoseller-recommender-system")
    app.container = container

    add_routes(app=app)

    return app
