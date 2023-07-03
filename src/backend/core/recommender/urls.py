from django.urls import path
from . import views


urlpatterns = [
    "storefront/<str:event>/",
    views.RecommenderSystemEventView.as_view(),
    "storefront/<str:event>/products/",
    views.RecommenderSystemEventView.as_view(),
]
