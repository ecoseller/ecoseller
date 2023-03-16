from . import views
from django.urls import path


urlpatterns = [
    path("", views.CategoryViewDashboard().as_view()),
    path("<int:pk>", views.CategoryDetailViewDashboard.as_view()),
    path("<int:id>/children", views.CategoryChildrenViewDashboard.as_view()),
]
