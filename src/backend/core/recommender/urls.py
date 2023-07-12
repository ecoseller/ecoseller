from django.urls import path
from . import views


urlpatterns = [
    path("storefront/<str:event>/", views.RecommenderSystemEventView.as_view()),
    path(
        "storefront/<str:situation>/products/",
        views.RecommenderSystemRecommendProductsView.as_view(),
    ),
    path(
        "dashboard/recommender-system",
        views.RecommenderSystemDashboardView.as_view(),
    ),
    path(
        "dashboard/recommender-system/config/",
        views.RecommenderSystemConfigView.as_view(),
    ),
]
