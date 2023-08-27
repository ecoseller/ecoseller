from flask import Flask

from recommender_system.server.views import (
    view_healthcheck,
    view_store_object,
    view_store_objects,
    view_predict,
    view_predict_product_positions,
    view_get_dashboard_configuration,
    view_get_dashboard_performance,
    view_get_dashboard_training,
)


def add_routes(app: Flask) -> None:
    app.add_url_rule("/", view_func=view_healthcheck, methods=["GET"])

    app.add_url_rule("/store_object", view_func=view_store_object, methods=["POST"])
    app.add_url_rule("/store_objects", view_func=view_store_objects, methods=["POST"])

    app.add_url_rule("/predict", view_func=view_predict, methods=["POST"])
    app.add_url_rule(
        "/predict/product_positions",
        view_func=view_predict_product_positions,
        methods=["POST"],
    )

    app.add_url_rule(
        "/dashboard/configuration",
        view_func=view_get_dashboard_configuration,
        methods=["GET"],
    )
    app.add_url_rule(
        "/dashboard/performance",
        view_func=view_get_dashboard_performance,
        methods=["GET"],
    )
    app.add_url_rule(
        "/dashboard/training", view_func=view_get_dashboard_training, methods=["GET"]
    )
