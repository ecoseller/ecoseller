from django.urls import path
from . import views


urlpatterns = [
    path("<str:token>/", views.CartDetailStorefrontView.as_view()),
    path(
        "<str:token>/update-quantity/", views.CartUpdateQuantityStorefrontView.as_view()
    ),
    path("<str:token>/<str:sku>/", views.CartItemDeleteStorefrontView.as_view()),
]
