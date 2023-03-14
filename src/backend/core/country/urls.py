from django.urls import path
from . import views


urlpatterns = [
    path("languages/", views.LanguagesView.as_view()),
]
