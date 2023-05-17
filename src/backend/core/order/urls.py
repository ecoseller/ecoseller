from django.urls import path
from . import views


urlpatterns = [
    path("dashboard/<str:token>/", views.OrderDetailDashboardView.as_view()),
    path("dashboard/", views.OrderListDashboardView.as_view()),
    path("storefront/", views.OrderCreateStorefrontView.as_view()),
]
