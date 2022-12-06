from django.urls import path
from . import views


urlpatterns = [
    path("listUsers", views.ListUsers.as_view()),
    path("register", views.RegistrationView.as_view()),
]
