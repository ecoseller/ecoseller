from django.urls import path
from . import views


urlpatterns = [
    path("dashboard/<str:token>/", views.OrderDetailDashboardView.as_view()),
    path("dashboard/", views.OrderListDashboardView.as_view()),
    path("storefront/", views.OrderCreateStorefrontView.as_view()),
    path("storefront/orders/", views.OrderListStorefrontView.as_view()),
    path("storefront/<str:token>/", views.OrderDetailStorefrontView.as_view()),
    path("storefront/<str:token>/items/", views.OrderItemsListStorefrontView.as_view()),
]
