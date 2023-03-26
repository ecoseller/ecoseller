from django.urls import path
from . import views


urlpatterns = [
    path("languages/", views.LanguagesView.as_view()),
    path("currency/", views.CurrencyListView.as_view()),
    path("currency/<str:code>/", views.CurrencyDetailView.as_view()),
]
