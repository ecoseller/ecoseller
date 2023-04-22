from flask import Flask

from recommender_system.server.views import (
    view_store_object,
    view_predict_homepage,
    view_predict_category_list,
    view_predict_product_detail,
    view_predict_cart,
)


def add_routes(app: Flask) -> None:
    app.add_url_rule("/store_object", view_func=view_store_object, methods=["POST"])
    app.add_url_rule(
        "/predict/homepage", view_func=view_predict_homepage, methods=["POST"]
    )
    app.add_url_rule(
        "/predict/category_list", view_func=view_predict_category_list, methods=["POST"]
    )
    app.add_url_rule(
        "/predict/product_detail",
        view_func=view_predict_product_detail,
        methods=["POST"],
    )
    app.add_url_rule("/predict/cart", view_func=view_predict_cart, methods=["POST"])
