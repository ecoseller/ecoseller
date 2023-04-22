from flask import Flask

from recommender_system.server.views import view_store_object


def add_routes(app: Flask) -> None:
    app.add_url_rule("/store_object", view_func=view_store_object, methods=["POST"])
