from . import views
from django.urls import path


urlpatterns = [
    path("dashboard/", views.CategoryViewDashboard().as_view()),
    path("dashboard/<int:pk>/", views.CategoryDetailViewDashboard.as_view()),
    path("storefront/<int:pk>/", views.CategoryTopLevelViewStorefront.as_view()),
    path("storefront/top-level/", views.CategoryTopLevelViewStorefront.as_view()),
    path("dashboard/<int:id>/children/", views.CategoryChildrenViewDashboard.as_view()),
]
