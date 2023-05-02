from . import views
from django.urls import path

urlpatterns = [
    path("dashboard/", views.CategoryDashboardView.as_view()),
    path("dashboard/<int:pk>/", views.CategoryDetailDashboardView.as_view()),
    path("storefront/", views.CategoryStorefrontView.as_view()),
    path("storefront/<int:pk>/", views.CategoryDetailStorefrontView.as_view()),
    path("storefront/<int:pk>/products/", views.CategoryDetailStorefrontView.as_view()),
    # path("dashboard/<int:id>/children/", views.CategoryChildrenViewDashboard.as_view()),
]
