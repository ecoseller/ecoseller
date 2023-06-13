from django.urls import path
from . import views


urlpatterns = [
    path(
        "storefront/product/<str:language>/<str:query>/",
        views.SearchProducts.as_view(),
    ),
]
