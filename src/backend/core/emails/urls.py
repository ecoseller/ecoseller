from django.urls import path
from . import views


urlpatterns = [
    path("order/confirmation/<str:order_id>/", views.OrderConfirmation.as_view()),
]
