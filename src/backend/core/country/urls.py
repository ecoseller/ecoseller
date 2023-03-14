from django.urls import path
from . import views


urlpatterns = [
    path("languages/", views.LanguagesView.as_view()),
    path("currency/", views.CurrencyView.as_view()),
    path("currency/<str:code>/", views.CurrencyView.as_view()),
]
