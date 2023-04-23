from . import views
from django.urls import path


urlpatterns = [
    path("", views.PageDashboardView().as_view()),
    path("<int:pk>", views.PageDashboardDetailView.as_view()),
]
