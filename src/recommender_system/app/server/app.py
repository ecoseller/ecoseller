from flask import Flask

from server.views import view_index


def create_app() -> Flask:
    app = Flask("Ecoseller-recommender-system")

    # Adding routes
    app.add_url_rule("/hello", view_func=view_index)

    return app
