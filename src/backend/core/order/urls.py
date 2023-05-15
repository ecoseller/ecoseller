from django.urls import path
from . import views


urlpatterns = [
    path("order/<str:token>/", views.OrderDetailView.as_view()),
    path("order/", views.OrderView.as_view()),
]
