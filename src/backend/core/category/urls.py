from . import views
from django.urls import path


urlpatterns = [
    path("", views.CategoryViewDashboard().as_view()),
    path("<int:pk>", views.CategoryDetailViewDashboard.as_view()),
]
