from . import views
from django.urls import path


urlpatterns = [
    path("", views.CategoryView().as_view()),
    path("<int:pk>", views.CategoryDetailView.as_view()),
]
