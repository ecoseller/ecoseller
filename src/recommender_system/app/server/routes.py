from flask import Flask

from server.views import view_index


def add_routes(app: Flask) -> None:
    app.add_url_rule("/hello", view_func=view_index)
